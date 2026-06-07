import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, ChatBubble, ScreenHeader } from '../components';
import { sendChatMessage } from '../services/chat';
import { useContentStore } from '../store/useContentStore';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import { currentLanguage } from '../i18n';
import { isVoiceInputAvailable, listenOnce, speakText, stopSpeaking } from '../services/voice';
import type { RootStackParamList } from '../navigation/types';

type ChatMessage = { id: string; text: string; isUser: boolean };

export function ChatScreen() {
  const route = useRoute();
  const params = (route.params ?? {}) as RootStackParamList['Chat'];
  const mode = params.mode ?? 'ai';
  const providerId = params.providerId;
  const providerName = params.providerName;
  const voiceEnabled = params.voice ?? false;

  const { t } = useTranslation();
  const chatConfig = useContentStore((s) => s.content.chat);
  const hydrateContent = useContentStore((s) => s.hydrate);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [input, setInput] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [sending, setSending] = useState(false);
  const [voiceInputReady, setVoiceInputReady] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { s, font, horizontalPadding } = useResponsive();

  const title =
    mode === 'nurse'
      ? providerName
        ? `${t('chat.titleNurse')} — ${providerName}`
        : t('chat.titleNurse')
      : t('chat.titleAi');

  useEffect(() => {
    hydrateContent();
    isVoiceInputAvailable().then(setVoiceInputReady);
    return () => stopSpeaking();
  }, [hydrateContent]);

  useEffect(() => {
    if (!welcomeShown && chatConfig.welcome_message) {
      setMessages([{ id: 'welcome', text: chatConfig.welcome_message, isUser: false }]);
      setWelcomeShown(true);
    }
  }, [chatConfig.welcome_message, welcomeShown]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const send = async (text?: string, inputMode: 'text' | 'voice' = 'text') => {
    const toSend = (text ?? input).trim();
    if (!toSend || sending) return;
    const userMsg = { id: Date.now().toString(), text: toSend, isUser: true };
    setMessages((m) => [...m, userMsg]);
    if (!text) setInput('');
    setSending(true);
    try {
      const res = await sendChatMessage({
        text: toSend,
        mode,
        inputMode,
        providerId: providerId ?? null,
      });
      const body = res.disclaimer ? `${res.text}\n\n— ${res.disclaimer}` : res.text;
      const reply = { id: (Date.now() + 1).toString(), text: body, isUser: false };
      setMessages((m) => [...m, reply]);
      if (voiceEnabled || inputMode === 'voice') {
        speakText(res.text, currentLanguage());
      }
    } finally {
      setSending(false);
    }
  };

  const handleVoice = async () => {
    if (isVoiceListening || sending) return;
    setIsVoiceListening(true);
    const transcript = await listenOnce(currentLanguage());
    setIsVoiceListening(false);
    if (!transcript) {
      Alert.alert(
        mode === 'nurse' ? t('chat.titleNurse') : t('chat.titleAi'),
        voiceInputReady
          ? 'Could not hear you. Check microphone permission and try again.'
          : 'Voice input needs a development build (not Expo Go). Type your message, or run: npx expo run:android',
      );
      return;
    }
    await send(transcript, 'voice');
  };

  const styles = StyleSheet.create({
    flex: { flex: 1 },
    disclaimer: {
      marginHorizontal: horizontalPadding,
      marginBottom: s(8),
      padding: s(10),
      backgroundColor: colors.softPink,
      borderRadius: 8,
    },
    disclaimerText: { fontSize: font(typography.sizes.sm), color: colors.textSecondary },
    list: { flex: 1 },
    listContent: {
      paddingHorizontal: horizontalPadding,
      paddingTop: horizontalPadding,
      flexGrow: 1,
    },
    voiceBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: s(10),
      marginHorizontal: horizontalPadding,
      marginBottom: s(8),
      borderRadius: 12,
      backgroundColor: colors.softPurple,
    },
    voiceBannerText: { fontSize: font(typography.sizes.sm), color: colors.textSecondary },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: s(8),
      paddingBottom: s(8),
      paddingHorizontal: horizontalPadding,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.softPink,
      gap: s(8),
    },
    inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    input: {
      flex: 1,
      fontSize: font(typography.sizes.base),
      color: colors.textPrimary,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 24,
      paddingVertical: s(8),
      paddingLeft: s(14),
      paddingRight: s(44),
      minHeight: 42,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputMic: { position: 'absolute', right: s(14), padding: s(4) },
    inputMicText: { fontSize: 22 },
    sendBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.coral,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendBtnDisabled: { opacity: 0.5 },
    sendIcon: { fontSize: 20, color: '#FFFFFF', fontWeight: typography.weights.bold },
  });

  const inputBottomPadding = Math.max(insets.bottom, s(6));

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScreenHeader title={title} />
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{t('chat.disclaimer')}</Text>
        </View>
        <ScrollView
          ref={scrollRef}
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: s(24) }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        >
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m.text} isUser={m.isUser} />
          ))}
        </ScrollView>
        {isVoiceListening && (
          <View style={styles.voiceBanner}>
            <Text style={styles.voiceBannerText}>{t('chat.listening')}</Text>
          </View>
        )}
        <KeyboardStickyView enabled={false}>
          <View style={[styles.inputRow, { paddingBottom: inputBottomPadding }]}>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder={chatConfig.input_placeholder || t('chat.placeholder')}
                placeholderTextColor={colors.textMuted}
                onSubmitEditing={() => send()}
                returnKeyType="send"
                editable={!isVoiceListening}
              />
              <TouchableOpacity
                style={[styles.inputMic, !voiceInputReady && { opacity: 0.45 }]}
                onPress={handleVoice}
                accessibilityLabel={t('chat.listening')}
              >
                <Text style={styles.inputMicText}>🎤</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.sendBtn, (!input.trim() || isVoiceListening) && styles.sendBtnDisabled]}
              onPress={() => send()}
              disabled={!input.trim() || isVoiceListening}
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardStickyView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
