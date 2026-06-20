import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, Card, PrimaryButton, SecondaryButton, KeyboardAwareScrollView } from '../components';
import { useContactsStore } from '../store/useContactsStore';
import { useResponsive } from '../hooks/useResponsive';
import { normalizePhoneNumber, pickPhoneContact } from '../services/phoneContacts';
import { colors, typography } from '../theme';

export function EmergencyContactsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { s, sVertical, font, horizontalPadding } = useResponsive();
  const contacts = useContactsStore((s2) => s2.contacts);
  const hydrate = useContactsStore((s2) => s2.hydrate);
  const add = useContactsStore((s2) => s2.add);
  const remove = useContactsStore((s2) => s2.remove);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const isDuplicate = (phoneNumber: string) => {
    const normalized = normalizePhoneNumber(phoneNumber);
    return contacts.some((c) => normalizePhoneNumber(c.phone) === normalized);
  };

  const saveContact = async (contactName: string, contactPhone: string, fromPhone = false) => {
    if (isDuplicate(contactPhone)) {
      Alert.alert(
        t('emergencyContacts.duplicateTitle'),
        t('emergencyContacts.duplicateBody', { name: contactName }),
      );
      return;
    }
    await add({ name: contactName, phone: contactPhone });
    if (fromPhone) {
      Alert.alert(t('emergencyContacts.addedTitle'), t('emergencyContacts.addedFromPhone', { name: contactName }));
    }
  };

  const handleAdd = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert(t('emergencyContacts.enterNamePhone'));
      return;
    }
    await saveContact(name.trim(), normalizePhoneNumber(phone.trim()));
    setName('');
    setPhone('');
  };

  const handlePickFromPhone = async () => {
    setPicking(true);
    try {
      const picked = await pickPhoneContact({
        notAvailableTitle: t('emergencyContacts.pickerUnavailableTitle'),
        notAvailableBody: t('emergencyContacts.pickerUnavailableBody'),
        noPhoneTitle: t('emergencyContacts.noPhoneTitle'),
        noPhoneBody: t('emergencyContacts.noPhoneBody'),
        chooseNumberTitle: t('emergencyContacts.chooseNumber'),
        cancel: t('common.cancel'),
      });
      if (picked) {
        await saveContact(picked.name, picked.phone, true);
      }
    } finally {
      setPicking(false);
    }
  };

  const handleRemove = (id: string) => {
    Alert.alert(t('emergencyContacts.removeTitle'), t('emergencyContacts.removeConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('emergencyContacts.remove'),
        style: 'destructive',
        onPress: () => remove(id),
      },
    ]);
  };

  const styles = StyleSheet.create({
    content: { padding: horizontalPadding, paddingBottom: s(48) },
    title: {
      fontSize: font(typography.sizes.xxl),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      marginBottom: s(12),
    },
    note: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: sVertical(16),
    },
    row: { flexDirection: 'row', gap: s(8), marginBottom: sVertical(12) },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: sVertical(10),
      backgroundColor: colors.surface,
      color: colors.textPrimary,
    },
    pickBtn: { marginBottom: sVertical(12) },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.backgroundSecondary,
    },
    listText: { fontSize: font(typography.sizes.base), color: colors.textPrimary, flex: 1 },
    emptyText: { color: colors.textSecondary },
    sectionLabel: {
      marginTop: 16,
      marginBottom: 8,
      color: colors.textSecondary,
      fontSize: font(typography.sizes.sm),
    },
  });

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} allowFontScaling>
          {t('emergencyContacts.title')}
        </Text>
        <Text style={styles.note} allowFontScaling>
          {t('emergencyContacts.pickerNote')}
        </Text>

        <Card>
          <SecondaryButton
            title={t('emergencyContacts.chooseFromPhone')}
            onPress={handlePickFromPhone}
            disabled={picking}
            style={styles.pickBtn}
          />
          <View style={styles.row}>
            <TextInput
              placeholder={t('emergencyContacts.namePlaceholder')}
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="words"
            />
            <TextInput
              placeholder={t('emergencyContacts.phonePlaceholder')}
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>
          <PrimaryButton title={t('emergencyContacts.addContact')} onPress={handleAdd} />
        </Card>

        <Text style={styles.sectionLabel}>{t('emergencyContacts.savedContacts')}</Text>
        {contacts.length === 0 ? (
          <Text style={styles.emptyText}>{t('emergencyContacts.empty')}</Text>
        ) : (
          contacts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.listItem}
              onPress={() => handleRemove(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, ${item.phone}`}
            >
              <Text style={styles.listText}>
                {item.name} — {item.phone}
              </Text>
              <Text style={{ color: colors.error }}>{t('emergencyContacts.remove')}</Text>
            </TouchableOpacity>
          ))
        )}

        <PrimaryButton
          title={t('emergencyContacts.done')}
          onPress={() => navigation.navigate('Main')}
          style={{ marginTop: 20 }}
        />
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
}
