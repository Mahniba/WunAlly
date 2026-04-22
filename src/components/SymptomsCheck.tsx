import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { PrimaryButton, SecondaryButton } from './index';
import { useSymptomsStore } from '../store/useSymptomsStore';
import { colors, typography } from '../theme';

export function SymptomsCheck({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const addEntry = useSymptomsStore((s) => s.addEntry);
  const [nausea, setNausea] = useState(false);
  const [headache, setHeadache] = useState(false);
  const [dizzy, setDizzy] = useState(false);
  const [notes, setNotes] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [painLevel, setPainLevel] = useState('');
  const [foodNote, setFoodNote] = useState('');

  const handleSave = () => {
    const sleep = sleepHours.trim() ? Number(sleepHours.trim()) : undefined;
    const pain = painLevel.trim() ? Number(painLevel.trim()) : undefined;

    addEntry({
      symptoms: { nausea, headache, dizzy },
      notes: notes.trim() || undefined,
      sleepHours: Number.isFinite(sleep) ? sleep : undefined,
      painLevel: Number.isFinite(pain) ? pain : undefined,
      foodNote: foodNote.trim() || undefined,
    });
    setNausea(false);
    setHeadache(false);
    setDizzy(false);
    setNotes('');
    setSleepHours('');
    setPainLevel('');
    setFoodNote('');
    onClose();
  };

  const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 20 },
    box: { backgroundColor: colors.surface, borderRadius: 12, padding: 18 },
    title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
    label: { color: colors.textPrimary, fontSize: 16 },
    checkbox: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'center' },
    fieldLabel: { color: colors.textSecondary, fontSize: 13, marginTop: 10, marginBottom: 6 },
    smallInput: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      borderRadius: 10,
      color: colors.textPrimary,
    },
    notes: { marginTop: 12, backgroundColor: colors.backgroundSecondary, padding: 10, borderRadius: 8, color: colors.textPrimary, minHeight: 60 },
    actions: { flexDirection: 'row', gap: 12, marginTop: 14 },
  });

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <TouchableOpacity onPress={onToggle} style={styles.checkbox} accessibilityRole="checkbox" accessibilityState={{ checked: value }}>
      <Text>{value ? '✓' : ''}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.box} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Daily Symptom Check</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nausea</Text>
            <Toggle value={nausea} onToggle={() => setNausea((v) => !v)} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Headache</Text>
            <Toggle value={headache} onToggle={() => setHeadache((v) => !v)} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dizziness</Text>
            <Toggle value={dizzy} onToggle={() => setDizzy((v) => !v)} />
          </View>
          <Text style={styles.fieldLabel}>Sleep (hours last night)</Text>
          <TextInput
            value={sleepHours}
            onChangeText={setSleepHours}
            keyboardType="numeric"
            placeholder="e.g. 7"
            placeholderTextColor={colors.textMuted}
            style={styles.smallInput}
          />
          <Text style={styles.fieldLabel}>Pain level (0–10)</Text>
          <TextInput
            value={painLevel}
            onChangeText={setPainLevel}
            keyboardType="numeric"
            placeholder="e.g. 3"
            placeholderTextColor={colors.textMuted}
            style={styles.smallInput}
          />
          <Text style={styles.fieldLabel}>Food / appetite (optional)</Text>
          <TextInput
            value={foodNote}
            onChangeText={setFoodNote}
            placeholder="e.g. nauseous in mornings, craving fruits"
            placeholderTextColor={colors.textMuted}
            style={styles.smallInput}
          />
          <TextInput
            placeholder="Notes (optional)"
            placeholderTextColor={colors.textMuted}
            style={styles.notes}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
          <View style={styles.actions}>
            <SecondaryButton title="Cancel" onPress={onClose} />
            <PrimaryButton title="Save" onPress={handleSave} />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
