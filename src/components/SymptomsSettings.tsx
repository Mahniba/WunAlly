import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { PrimaryButton, SecondaryButton } from './index';
import { getSymptomReminderTime, setSymptomReminderTime } from '../services/storage';
import { scheduleDailyReminder } from '../services/notifications';
import { colors } from '../theme';

export function SymptomsSettings({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [time, setTime] = useState('09:00');

  useEffect(() => {
    if (!visible) return;
    (async () => {
      const t = await getSymptomReminderTime();
      if (t) setTime(t);
    })();
  }, [visible]);

  const handleSave = async () => {
    // expect HH:MM
    const m = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) {
      Alert.alert('Invalid time', 'Enter time as HH:MM (24-hour)');
      return;
    }
    let h = parseInt(m[1], 10);
    let mm = parseInt(m[2], 10);
    if (isNaN(h) || isNaN(mm) || h < 0 || h > 23 || mm < 0 || mm > 59) {
      Alert.alert('Invalid time', 'Enter a valid 24-hour time');
      return;
    }
    await setSymptomReminderTime(time);
    await scheduleDailyReminder(h, mm);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Symptom Reminder Time</Text>
          <Text style={styles.help}>Enter a daily reminder time (24-hour HH:MM)</Text>
          <TextInput value={time} onChangeText={setTime} style={styles.input} keyboardType="numeric" />
          <View style={styles.actions}>
            <SecondaryButton title="Cancel" onPress={onClose} />
            <PrimaryButton title="Save" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 20 },
  box: { backgroundColor: colors.surface, borderRadius: 12, padding: 18 },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  help: { color: colors.textSecondary, marginBottom: 12 },
  input: { backgroundColor: colors.backgroundSecondary, padding: 10, borderRadius: 8, marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
});
