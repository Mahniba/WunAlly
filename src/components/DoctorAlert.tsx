import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { colors, typography } from '../theme';
import { useContactsStore } from '../store/useContactsStore';
import { getMyAssignment } from '../services/api/network';
import { callFirstContact } from '../services/sosAlerts';
import { navigate } from '../navigation/NavigationService';

function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, '');
}

export function DoctorAlert({
  visible,
  onClose,
  message,
}: {
  visible: boolean;
  onClose: () => void;
  message: string;
}) {
  const { t } = useTranslation();
  const contacts = useContactsStore((s) => s.contacts);
  const hydrateContacts = useContactsStore((s) => s.hydrate);
  const [nurseName, setNurseName] = useState<string | null>(null);
  const [nursePhone, setNursePhone] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    hydrateContacts();
    getMyAssignment()
      .then((assignment) => {
        if (assignment?.provider?.phone) {
          setNurseName(assignment.provider.name);
          setNursePhone(assignment.provider.phone);
        } else {
          setNurseName(null);
          setNursePhone(null);
        }
      })
      .catch(() => {
        setNurseName(null);
        setNursePhone(null);
      });
  }, [visible, hydrateContacts]);

  const callPhone = async (phone: string, label: string) => {
    const tel = `tel:${normalizePhone(phone)}`;
    try {
      const can = await Linking.canOpenURL(tel);
      if (!can) {
        Alert.alert(t('doctorAlert.cannotCall'), label);
        return;
      }
      await Linking.openURL(tel);
    } catch {
      Alert.alert(t('doctorAlert.cannotCall'), label);
    }
  };

  const textPhones = async (phones: string[]) => {
    const cleaned = phones.map(normalizePhone).filter(Boolean);
    if (cleaned.length === 0) return;
    const body = encodeURIComponent(t('doctorAlert.smsBody', { message }));
    const url = `sms:${cleaned.join(',')}?body=${body}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('common.error'));
    }
  };

  const handleCallFirst = async () => {
    if (contacts.length > 0) {
      const ok = await callFirstContact(
        contacts.map((c) => ({ name: c.name, phone: c.phone }))
      );
      if (ok) return;
      await callPhone(contacts[0].phone, contacts[0].name);
      return;
    }
    if (nursePhone) {
      await callPhone(nursePhone, nurseName ?? t('network.assigned'));
      return;
    }
    Alert.alert(t('doctorAlert.noContactTitle'), t('doctorAlert.noContactBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('doctorAlert.addContact'),
        onPress: () => {
          onClose();
          navigate('EmergencyContacts');
        },
      },
    ]);
  };

  const handleMessage = () => {
    const phones = contacts.map((c) => c.phone).filter(Boolean);
    if (phones.length > 0) {
      void textPhones(phones);
      return;
    }
    if (nursePhone) {
      void textPhones([nursePhone]);
      return;
    }
    Alert.alert(t('doctorAlert.noContactTitle'), t('doctorAlert.noContactBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('doctorAlert.addContact'),
        onPress: () => {
          onClose();
          navigate('EmergencyContacts');
        },
      },
    ]);
  };

  const hasAnyNumber = contacts.length > 0 || Boolean(nursePhone);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{t('doctorAlert.title')}</Text>
          <Text style={styles.message}>{message}</Text>

          {hasAnyNumber ? (
            <ScrollView style={styles.contactList} nestedScrollEnabled>
              <Text style={styles.contactsHeading}>{t('doctorAlert.callThese')}</Text>
              {contacts.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.contactRow}
                  onPress={() => callPhone(c.phone, c.name)}
                  accessibilityRole="button"
                  accessibilityLabel={t('doctorAlert.callName', { name: c.name })}
                >
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{c.name}</Text>
                    <Text style={styles.contactPhone}>{c.phone}</Text>
                  </View>
                  <Text style={styles.contactAction}>{t('doctorAlert.call')}</Text>
                </TouchableOpacity>
              ))}
              {nursePhone ? (
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => callPhone(nursePhone, nurseName ?? '')}
                  accessibilityRole="button"
                >
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>
                      {nurseName ?? t('network.assigned')}
                    </Text>
                    <Text style={styles.contactPhone}>{nursePhone}</Text>
                    <Text style={styles.contactHint}>{t('doctorAlert.assignedNurse')}</Text>
                  </View>
                  <Text style={styles.contactAction}>{t('doctorAlert.call')}</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          ) : (
            <Text style={styles.noContacts}>{t('doctorAlert.noContactsListed')}</Text>
          )}

          <View style={styles.actionsColumn}>
            {hasAnyNumber ? (
              <>
                <PrimaryButton
                  title={t('doctorAlert.callHelp')}
                  onPress={handleCallFirst}
                  style={styles.fullBtn}
                />
                <PrimaryButton
                  title={t('doctorAlert.messageHelp')}
                  onPress={handleMessage}
                  style={[styles.fullBtn, styles.msgBtn]}
                />
              </>
            ) : (
              <PrimaryButton
                title={t('doctorAlert.addContact')}
                onPress={() => {
                  onClose();
                  navigate('EmergencyContacts');
                }}
                style={styles.fullBtn}
              />
            )}
            <SecondaryButton title={t('doctorAlert.dismiss')} onPress={onClose} style={styles.fullBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 20,
  },
  box: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    maxHeight: '85%',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.sizes.base,
    lineHeight: 22,
    marginBottom: 12,
  },
  contactsHeading: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.coralDark,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactList: { maxHeight: 200, marginBottom: 12 },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  contactInfo: { flex: 1, marginRight: 8 },
  contactName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  contactPhone: {
    fontSize: typography.sizes.base,
    color: colors.coralDark,
    fontWeight: typography.weights.medium,
    marginTop: 2,
  },
  contactHint: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  contactAction: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.coralDark,
  },
  noContacts: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  actionsColumn: { flexDirection: 'column', gap: 8 },
  fullBtn: { width: '100%' },
  msgBtn: { marginTop: 4 },
});
