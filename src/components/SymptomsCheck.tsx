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

  const handleSave = () => {
    addEntry({ symptoms: { nausea, headache, dizzy }, notes: notes.trim() || undefined });
    setNausea(false);
    setHeadache(false);
    setDizzy(false);
    setNotes('');
    onClose();
  };

  const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 20 },
    box: { backgroundColor: colors.surface, borderRadius: 12, padding: 18 },
    title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
    label: { color: colors.textPrimary, fontSize: 16 },
    checkbox: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'center' },
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
