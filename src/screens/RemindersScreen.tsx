import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ScreenContainer, PrimaryButton, SecondaryButton, ReminderItem } from '../components';
import { useRemindersStore } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

const iconStyles = StyleSheet.create({
  icon: { fontSize: 20 },
  doctor: { fontSize: 20, color: colors.error },
});

function IconDoctor() { return <Text style={iconStyles.doctor}>✕</Text>; }
function IconVitamins() { return <Text style={iconStyles.icon}>💊</Text>; }
function IconGeneral() { return <Text style={iconStyles.icon}>🔔</Text>; }

export function RemindersScreen() {
  const { reminders, toggleReminder, addReminder, removeReminder, hydrate, setReminders } = useRemindersStore();
  const { s, font, horizontalPadding } = useResponsive();
  const [ready, setReady] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('9:00 AM');

  React.useEffect(() => {
    hydrate().then(() => setReady(true));
  }, [hydrate]);

  const getIcon = (iconType?: string) => {
    if (iconType === 'doctor') return <IconDoctor />;
    if (iconType === 'vitamins') return <IconVitamins />;
    return <IconGeneral />;
  };

  const handleAdd = () => {
    const title = newTitle.trim() || 'New reminder';
    addReminder({ title, time: newTime.trim() || '9:00 AM', completed: false });
    setNewTitle('');
    setNewTime('9:00 AM');
    setShowAdd(false);
  };

  const handleClearCompleted = () => {
    if (reminders.length > 0) {
      setReminders(reminders.filter((r) => !r.completed));
    }
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: horizontalPadding,
      paddingTop: s(16),
      paddingBottom: s(12),
    },
    title: {
      fontSize: font(typography.sizes.xxl),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
    },
    trashBtn: {
      padding: s(8),
      minWidth: 44,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    trashIcon: { fontSize: 22, color: colors.textSecondary },
    scroll: { flex: 1 },
    content: { padding: horizontalPadding, paddingBottom: s(48), flexGrow: 1 },
    addBtn: { marginTop: s(20) },
    empty: {
      paddingVertical: s(32),
      alignItems: 'center',
    },
    emptyText: { fontSize: font(typography.sizes.base), color: colors.textSecondary },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      padding: horizontalPadding,
    },
    modalBox: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: s(24),
    },
    modalTitle: {
      fontSize: font(typography.sizes.lg),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      marginBottom: s(16),
    },
    modalInput: {
      fontSize: font(typography.sizes.base),
      color: colors.textPrimary,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: s(14),
      marginBottom: s(12),
      borderWidth: 1,
      borderColor: colors.softPink,
    },
    modalRow: { flexDirection: 'row', gap: s(12), marginTop: s(8) },
    modalCancel: { flex: 1 },
  });

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Reminders
        </Text>
        <TouchableOpacity
          style={styles.trashBtn}
          onPress={handleClearCompleted}
          accessible
          accessibilityLabel="Clear completed reminders"
          accessibilityRole="button"
        >
          <Text style={styles.trashIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {reminders.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No reminders yet. Add one below.</Text>
          </View>
        ) : (
          reminders.map((r) => (
            <ReminderItem
              key={r.id}
              title={r.title}
              time={r.time}
              icon={getIcon(r.iconType)}
              completed={r.completed}
              onComplete={() => toggleReminder(r.id)}
              onDelete={() => removeReminder(r.id)}
            />
          ))
        )}
        <PrimaryButton
          title="+ Add Reminder"
          onPress={() => setShowAdd(true)}
          style={styles.addBtn}
        />
      </ScrollView>

      <Modal visible={showAdd} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAdd(false)}>
          <TouchableOpacity style={styles.modalBox} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Add Reminder</Text>
            <TextInput
              style={styles.modalInput}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="e.g. Doctor's appointment"
              placeholderTextColor={colors.textMuted}
              autoFocus
            />
            <TextInput
              style={styles.modalInput}
              value={newTime}
              onChangeText={setNewTime}
              placeholder="Time (e.g. 10:30 AM)"
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.modalRow}>
              <SecondaryButton title="Cancel" onPress={() => setShowAdd(false)} style={styles.modalCancel} />
              <PrimaryButton title="Add" onPress={handleAdd} style={styles.modalCancel} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScreenContainer>
  );
}
