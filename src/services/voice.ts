import Constants from 'expo-constants';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

/** expo-speech-recognition requires a dev build — not available in Expo Go. */
type SpeechRecognitionModule = {
  requestPermissionsAsync: () => Promise<{ granted: boolean }>;
  start: (options: {
    lang?: string;
    interimResults?: boolean;
    continuous?: boolean;
    requiresOnDeviceRecognition?: boolean;
  }) => void;
  stop: () => void;
  addListener: (
    event: string,
    listener: (event: {
      isFinal?: boolean;
      results?: { transcript?: string }[];
    }) => void,
  ) => { remove: () => void };
};

let recognitionModule: SpeechRecognitionModule | null | undefined;

async function getRecognition(): Promise<SpeechRecognitionModule | null> {
  if (recognitionModule !== undefined) return recognitionModule;
  // Native speech recognition is not bundled in Expo Go.
  if (Constants.appOwnership === 'expo') {
    recognitionModule = null;
    return null;
  }
  try {
    const mod = await import('expo-speech-recognition');
    recognitionModule = mod.ExpoSpeechRecognitionModule as SpeechRecognitionModule;
    return recognitionModule;
  } catch {
    recognitionModule = null;
    return null;
  }
}

/** False in Expo Go; true after a successful dev build with native speech recognition. */
export async function isVoiceInputAvailable(): Promise<boolean> {
  return (await getRecognition()) != null;
}

export async function requestVoicePermissions(): Promise<boolean> {
  const rec = await getRecognition();
  if (!rec) return false;
  try {
    const { granted } = await rec.requestPermissionsAsync();
    return granted;
  } catch {
    return false;
  }
}

export function speakText(text: string, language: string): void {
  const clean = text.replace(/\n—.*$/s, '').trim();
  if (!clean) return;
  Speech.stop();
  Speech.speak(clean, {
    language: language.startsWith('fr') ? 'fr-FR' : 'en-US',
    rate: Platform.OS === 'ios' ? 0.92 : 0.95,
  });
}

export function stopSpeaking(): void {
  Speech.stop();
}

export async function listenOnce(language: string, timeoutMs = 12000): Promise<string | null> {
  const rec = await getRecognition();
  if (!rec) return null;

  const granted = await requestVoicePermissions();
  if (!granted) return null;

  const lang = language.startsWith('fr') ? 'fr-FR' : 'en-US';

  return new Promise((resolve) => {
    let finished = false;
    const finish = (value: string | null) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resultSub.remove();
      errorSub.remove();
      endSub.remove();
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
      resolve(value);
    };

    const timer = setTimeout(() => finish(null), timeoutMs);

    const resultSub = rec.addListener('result', (event) => {
      const transcript = event.results?.[0]?.transcript?.trim();
      if (!transcript) return;
      if (event.isFinal) {
        finish(transcript);
      }
    });

    const errorSub = rec.addListener('error', () => finish(null));
    const endSub = rec.addListener('speechend', () => {});

    try {
      rec.start({
        lang,
        interimResults: true,
        continuous: false,
        requiresOnDeviceRecognition: true,
      });
    } catch {
      finish(null);
    }
  });
}
