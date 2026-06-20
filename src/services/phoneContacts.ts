import * as Contacts from 'expo-contacts';
import { Alert, Platform } from 'react-native';

export interface PickedPhoneContact {
  name: string;
  phone: string;
}

export function normalizePhoneNumber(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^\d+]/g, '');
  return digits || trimmed;
}

function displayName(contact: Contacts.Contact): string {
  if (contact.name?.trim()) return contact.name.trim();
  const parts = [contact.firstName, contact.lastName].filter(Boolean);
  return parts.join(' ').trim() || 'Contact';
}

type PhonePickResult = { phone: string } | { cancelled: true } | { noPhone: true };

function pickPhoneNumber(
  contact: Contacts.Contact,
  chooseTitle: string,
  cancelLabel: string,
): Promise<PhonePickResult> {
  const phones = (contact.phoneNumbers ?? []).filter((p) => p.number?.trim());
  if (phones.length === 0) return Promise.resolve({ noPhone: true });
  if (phones.length === 1) {
    return Promise.resolve({ phone: normalizePhoneNumber(phones[0].number!) });
  }

  return new Promise((resolve) => {
    Alert.alert(
      chooseTitle,
      displayName(contact),
      [
        ...phones.map((p) => ({
          text: p.label ? `${p.label}: ${p.number}` : p.number!,
          onPress: () => resolve({ phone: normalizePhoneNumber(p.number!) }),
        })),
        { text: cancelLabel, style: 'cancel' as const, onPress: () => resolve({ cancelled: true }) },
      ],
      { cancelable: true, onDismiss: () => resolve({ cancelled: true }) },
    );
  });
}

/**
 * Opens the native contact picker and returns name + phone for WunAlly SOS storage.
 * Does not modify system emergency / Medical ID lists.
 */
export async function pickPhoneContact(labels: {
  notAvailableTitle: string;
  notAvailableBody: string;
  noPhoneTitle: string;
  noPhoneBody: string;
  chooseNumberTitle: string;
  cancel: string;
}): Promise<PickedPhoneContact | null> {
  if (Platform.OS === 'web') {
    Alert.alert(labels.notAvailableTitle, labels.notAvailableBody);
    return null;
  }

  try {
    const contact = await Contacts.presentContactPickerAsync();
    if (!contact) return null;

    const picked = await pickPhoneNumber(contact, labels.chooseNumberTitle, labels.cancel);
    if ('cancelled' in picked) return null;
    if ('noPhone' in picked) {
      Alert.alert(labels.noPhoneTitle, labels.noPhoneBody);
      return null;
    }

    return { name: displayName(contact), phone: picked.phone };
  } catch {
    Alert.alert(labels.notAvailableTitle, labels.notAvailableBody);
    return null;
  }
}
