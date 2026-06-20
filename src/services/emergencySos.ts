import { Alert } from 'react-native';
import { OFFLINE_EMERGENCY } from '../assets/offlineEmergency';
import type { EmergencyGuide } from './api/content';
import { triggerSosAlert } from './sosAlerts';
import { useContactsStore } from '../store/useContactsStore';
import { useContentStore } from '../store/useContentStore';
import { hasAccessToken } from './api/session';

export async function executeEmergencySos(options?: {
  title?: string;
  sentMessage?: string;
  partialMessage?: string;
  noContactMessage?: string;
}): Promise<boolean> {
  await useContactsStore.getState().hydrate();
  const contacts = useContactsStore.getState().contacts;

  if (contacts.length === 0) {
    if (options?.noContactMessage) {
      Alert.alert(options.title ?? 'SOS', options.noContactMessage);
    }
    return false;
  }

  const content = useContentStore.getState().content.emergency_guide;
  const guide = content?.steps?.length ? content : OFFLINE_EMERGENCY;
  const offline = !(await hasAccessToken());

  const result = await triggerSosAlert(
    contacts.map((c) => ({ name: c.name, phone: c.phone })),
    guide as EmergencyGuide | typeof OFFLINE_EMERGENCY,
    { fetchLocation: true, offline },
  );

  const message =
    result.notified > 0
      ? (options?.sentMessage ?? 'Emergency contacts notified.')
      : (options?.partialMessage ?? 'SOS logged. Try Call for help if messages did not send.');

  Alert.alert(options?.title ?? 'SOS', message);
  return result.notified > 0;
}
