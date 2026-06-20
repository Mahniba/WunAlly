import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import {
  TabScreenContainer,
  PrimaryButton,
  SecondaryButton,
  ReminderItem,
  KeyboardAwareScrollView,
  KeyboardModal,
} from '../components';
import { useRemindersStore } from '../store';
import { useContentStore } from '../store/useContentStore';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import { formatReminderDateLabel, toIsoDate } from '../utils/reminderTime';
import type { Reminder } from '../types';

const iconStyles = StyleSheet.create({
  icon: { fontSize: 20 },
  doctor: { fontSize: 20, color: colors.error },
});

function IconDoctor() {
  return <Text style={iconStyles.doctor}>✕</Text>;
}
function IconVitamins() {
  return <Text style={iconStyles.icon}>💊</Text>;
}
function IconGeneral() {
  return <Text style={iconStyles.icon}>🔔</Text>;
}

type IconType = NonNullable<Reminder['iconType']>;

function formatTime12h(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

function defaultMorningTime(): Date {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  return d;
}

export function RemindersScreen() {
  const { t } = useTranslation();
  const { reminders, toggleReminder, addReminder, removeReminder, hydrate, setReminders } =
    useRemindersStore();
  const presets = useContentStore((s) => s.content.reminder_presets);
  const hydrateContent = useContentStore((s) => s.hydrate);
  const { s, font, horizontalPadding } = useResponsive();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('9:00 AM');
  const [newIconType, setNewIconType] = useState<IconType>('general');
  const [scheduledDate, setScheduledDate] = useState<string | undefined>();
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(defaultMorningTime);

  React.useEffect(() => {
    hydrateContent();
    void hydrate();
  }, [hydrate, hydrateContent]);

  const getIcon = (iconType?: string) => {
    if (iconType === 'doctor') return <IconDoctor />;
    if (iconType === 'vitamins') return <IconVitamins />;
    return <IconGeneral />;
  };

  const resetForm = () => {
    setNewTitle('');
    setNewTime('9:00 AM');
    setNewIconType('general');
    setScheduledDate(undefined);
    setAddToCalendar(false);
    setSelectedTime(defaultMorningTime());
  };

  const handleAdd = async () => {
    const title = newTitle.trim() || 'New reminder';
    await addReminder({
      title,
      time: newTime.trim() || '9:00 AM',
      iconType: newIconType,
      scheduledDate,
      addToCalendar: addToCalendar && !!scheduledDate,
    });
    resetForm();
    setShowAdd(false);
  };

  const handleClearCompleted = () => {
    if (reminders.length > 0) {
      setReminders(reminders.filter((r) => !r.completed));
    }
  };

  const formatReminderTimeLine = (r: Reminder) => {
    if (r.scheduledDate) {
      return `${formatReminderDateLabel(r.scheduledDate)} · ${r.time}`;
    }
    return `${r.time} · ${t('reminders.dailyRepeat')}`;
  };

  const iconTypes: { key: IconType; label: string }[] = [
    { key: 'doctor', label: t('reminders.typeDoctor') },
    { key: 'vitamins', label: t('reminders.typeVitamins') },
    { key: 'general', label: t('reminders.typeGeneral') },
  ];

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
      maxHeight: '90%',
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
    fieldLabel: {
      fontSize: font(typography.sizes.sm),
      fontWeight: typography.weights.medium,
      color: colors.textSecondary,
      marginBottom: s(6),
    },
    pickerBtn: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: s(14),
      marginBottom: s(12),
      borderWidth: 1,
      borderColor: colors.softPink,
    },
    pickerBtnText: {
      fontSize: font(typography.sizes.base),
      color: colors.textPrimary,
    },
    typeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: s(8),
      marginBottom: s(12),
    },
    typeChip: {
      paddingHorizontal: s(12),
      paddingVertical: s(8),
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.softPink,
      backgroundColor: colors.backgroundSecondary,
    },
    typeChipActive: {
      backgroundColor: colors.chipReminders,
      borderColor: colors.coral,
    },
    typeChipText: {
      fontSize: font(typography.sizes.sm),
      color: colors.textPrimary,
    },
    calendarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(10),
      marginBottom: s(12),
      opacity: 1,
    },
    calendarRowDisabled: { opacity: 0.45 },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.coral,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxOn: { backgroundColor: colors.coral },
    checkboxMark: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    calendarLabel: {
      flex: 1,
      fontSize: font(typography.sizes.sm),
      color: colors.textPrimary,
    },
    modalRow: { flexDirection: 'row', gap: s(12), marginTop: s(8) },
    modalCancel: { flex: 1 },
  });

  return (
    <TabScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          {t('reminders.title')}
        </Text>
        <TouchableOpacity
          style={styles.trashBtn}
          onPress={handleClearCompleted}
          accessible
          accessibilityLabel={t('reminders.clearCompleted')}
          accessibilityRole="button"
        >
          <Text style={styles.trashIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {reminders.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('reminders.empty')}</Text>
          </View>
        ) : (
          reminders.map((r) => (
            <ReminderItem
              key={r.id}
              title={r.title}
              time={formatReminderTimeLine(r)}
              icon={getIcon(r.iconType)}
              completed={r.completed}
              onComplete={() => toggleReminder(r.id)}
              onDelete={() => removeReminder(r.id)}
            />
          ))
        )}
        <PrimaryButton
          title={t('reminders.addReminder')}
          onPress={() => setShowAdd(true)}
          style={styles.addBtn}
        />
      </KeyboardAwareScrollView>

      <KeyboardModal visible={showAdd} transparent animationType="fade" justify="flex-end">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowAdd(false);
            resetForm();
          }}
        >
          <TouchableOpacity style={styles.modalBox} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>{t('reminders.addTitle')}</Text>
            {presets.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {presets.map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    onPress={() => setNewTitle(p.title)}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 8,
                      backgroundColor: colors.chipReminders,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: colors.textPrimary }}>{p.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TextInput
              style={styles.modalInput}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder={t('reminders.titlePlaceholder')}
              placeholderTextColor={colors.textMuted}
              autoFocus
            />

            <Text style={styles.fieldLabel}>{t('reminders.dateLabel')}</Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerBtnText}>
                {scheduledDate ? formatReminderDateLabel(scheduledDate) : t('reminders.noDate')}
              </Text>
            </TouchableOpacity>
            {scheduledDate ? (
              <TouchableOpacity
                onPress={() => {
                  setScheduledDate(undefined);
                  setAddToCalendar(false);
                }}
                style={{ marginBottom: s(12) }}
              >
                <Text style={{ fontSize: font(typography.sizes.sm), color: colors.coral }}>
                  {t('reminders.noDate')}
                </Text>
              </TouchableOpacity>
            ) : null}
            {showDatePicker && (
              <DateTimePicker
                value={scheduledDate ? new Date(`${scheduledDate}T12:00:00`) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                minimumDate={new Date()}
                onChange={(_, d) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (d) setScheduledDate(toIsoDate(d));
                }}
              />
            )}

            <Text style={styles.fieldLabel}>{t('reminders.pickTime')}</Text>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.pickerBtnText}>{newTime}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, d) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (d) {
                    setSelectedTime(d);
                    setNewTime(formatTime12h(d));
                  }
                }}
              />
            )}

            <Text style={styles.fieldLabel}>{t('reminders.typeLabel')}</Text>
            <View style={styles.typeRow}>
              {iconTypes.map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.typeChip, newIconType === key && styles.typeChipActive]}
                  onPress={() => setNewIconType(key)}
                >
                  <Text style={styles.typeChipText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.calendarRow, !scheduledDate && styles.calendarRowDisabled]}
              onPress={() => scheduledDate && setAddToCalendar((v) => !v)}
              disabled={!scheduledDate}
            >
              <View style={[styles.checkbox, addToCalendar && styles.checkboxOn]}>
                {addToCalendar ? <Text style={styles.checkboxMark}>✓</Text> : null}
              </View>
              <Text style={styles.calendarLabel}>{t('reminders.addToCalendar')}</Text>
            </TouchableOpacity>

            <View style={styles.modalRow}>
              <SecondaryButton
                title={t('reminders.cancel')}
                onPress={() => {
                  setShowAdd(false);
                  resetForm();
                }}
                style={styles.modalCancel}
              />
              <PrimaryButton title={t('reminders.add')} onPress={handleAdd} style={styles.modalCancel} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardModal>
    </TabScreenContainer>
  );
}
