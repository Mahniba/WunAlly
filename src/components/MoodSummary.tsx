import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useMoodStore, MoodType } from '../store/useMoodStore';
import { colors, typography } from '../theme';
import PregnantIllustration from './art/PregnantIllustration';

// Charts: optional dependency. If not installed, we'll show simple textual stats.
let ChartKit: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ChartKit = require('react-native-chart-kit');
} catch {}

const MOODS: { key: MoodType; label: string; emoji: string; color: string }[] = [
  { key: 'happy', label: 'Happy', emoji: '😊', color: '#4CAF50' },
  { key: 'ok', label: 'Okay', emoji: '🙂', color: '#2196F3' },
  { key: 'tired', label: 'Tired', emoji: '😴', color: '#FFB300' },
  { key: 'sleepy', label: 'Sleepy', emoji: '💤', color: '#8E24AA' },
  { key: 'confused', label: 'Confused', emoji: '😕', color: '#FF7043' },
  { key: 'sad', label: 'Sad', emoji: '😢', color: '#1565C0' },
  { key: 'anxious', label: 'Anxious', emoji: '😰', color: '#E53935' },
  { key: 'stressed', label: 'Stressed', emoji: '😣', color: '#6D4C41' },
];

export function MoodSummary() {
  const entries = useMoodStore((s) => s.entries);
  const hydrate = useMoodStore((s) => s.hydrate);
  const addEntry = useMoodStore((s) => s.addEntry);
  const [selected, setSelected] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    // hydrate once on mount
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const freq = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of entries) map.set(m.mood, (map.get(m.mood) || 0) + 1);
    return map;
  }, [entries]);

  const pieData = MOODS.map((m) => ({ name: m.label, population: freq.get(m.key) || 0, color: m.color, legendFontColor: '#333', legendFontSize: 12 }));

  // Prepare daily series for last 14 days
  const DAYS = 14;
  const dayBuckets: number[] = Array.from({ length: DAYS }, () => 0);
  const now = Date.now();
  for (const e of entries) {
    const daysAgo = Math.floor((now - e.timestamp) / (1000 * 60 * 60 * 24));
    if (daysAgo >= 0 && daysAgo < DAYS) {
      dayBuckets[DAYS - 1 - daysAgo] += 1;
    }
  }

  const screenWidth = Dimensions.get('window').width - 32;

  const saveMood = async () => {
    if (!selected) return;
    await addEntry(selected, note || undefined);
    setSelected(null);
    setNote('');
  };

  // Weekly mini-trend (last 7 days)
  const DAYS_W = 7;
  const nowW = Date.now();
  const dayEmojis: string[] = [];
  for (let i = DAYS_W - 1; i >= 0; i--) {
    const dayStart = nowW - i * 24 * 60 * 60 * 1000;
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const dayEntries = entries.filter((e) => e.timestamp >= dayStart && e.timestamp < dayEnd);
    if (dayEntries.length === 0) dayEmojis.push('—');
    else {
      const top = dayEntries[0].mood;
      const map = MOODS.find((m) => m.key === top);
      dayEmojis.push(map?.emoji || '•');
    }
  }

  // counts
  const counts = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);

  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { pieFiltered, labels, series } = useMemo(() => {
    const now = Date.now();
    let start = 0;
    let buckets: number[] = [];
    let lbls: string[] = [];

    if (range === 'daily') {
      const days = 7;
      buckets = Array.from({ length: days }, () => 0);
      for (const e of entries) {
        const daysAgo = Math.floor((now - e.timestamp) / (1000 * 60 * 60 * 24));
        if (daysAgo >= 0 && daysAgo < days) buckets[days - 1 - daysAgo] += 1;
      }
      lbls = Array.from({ length: days }, (_, i) => '');
      start = now - (days - 1) * 24 * 60 * 60 * 1000;
    } else if (range === 'weekly') {
      const weeks = 12;
      buckets = Array.from({ length: weeks }, () => 0);
      for (const e of entries) {
        const weeksAgo = Math.floor((now - e.timestamp) / (1000 * 60 * 60 * 24 * 7));
        if (weeksAgo >= 0 && weeksAgo < weeks) buckets[weeks - 1 - weeksAgo] += 1;
      }
      lbls = Array.from({ length: weeks }, (_, i) => '');
      start = now - (weeks - 1) * 7 * 24 * 60 * 60 * 1000;
    } else {
      const months = 6;
      buckets = Array.from({ length: months }, () => 0);
      for (const e of entries) {
        const monthsAgo = Math.floor((now - e.timestamp) / (1000 * 60 * 60 * 24 * 30));
        if (monthsAgo >= 0 && monthsAgo < months) buckets[months - 1 - monthsAgo] += 1;
      }
      lbls = Array.from({ length: months }, (_, i) => '');
      start = now - (months - 1) * 30 * 24 * 60 * 60 * 1000;
    }

    const pieMap = new Map<string, number>();
    for (const e of entries) {
      if (e.timestamp >= start) pieMap.set(e.mood, (pieMap.get(e.mood) || 0) + 1);
    }

    const pie = MOODS.map((m) => ({ name: m.label, population: pieMap.get(m.key) || 0, color: m.color, legendFontColor: '#333', legendFontSize: 12 }));

    return { pieFiltered: pie, labels: lbls, series: buckets };
  }, [entries, range]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Track Your Mood</Text>

      <Text style={styles.prompt}>How are you feeling today?</Text>
      <View style={styles.buttonRow}>
        {MOODS.map((m) => {
          const active = selected === m.key;
          return (
            <TouchableOpacity
              key={m.key}
              style={[styles.moodBtnLarge, { backgroundColor: active ? '#fff' : m.color, borderColor: active ? m.color : 'transparent', borderWidth: active ? 2 : 0 }]}
              onPress={() => setSelected(m.key)}
              accessibilityLabel={`Select ${m.label} mood`}
            >
              <Text style={styles.moodEmojiLarge}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, active ? styles.moodLabelActive : undefined]}>{m.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput value={note} onChangeText={setNote} placeholder="Add a note (optional)..." style={styles.noteInput} />
      <TouchableOpacity style={styles.saveBtn} onPress={saveMood} accessibilityLabel="Save Mood">
        <Text style={styles.saveBtnText}>Save Mood</Text>
      </TouchableOpacity>

      <View style={styles.trendsWrap}>
        <Text style={styles.trendsTitle}>Mood Trends This Week</Text>
        <View style={styles.trendRow}>
          <View style={styles.illustrationBox}>
            <PregnantIllustration size={72} />
          </View>
          <View style={styles.trendRight}>
            <View style={styles.weekEmojisRow}>
              {dayEmojis.map((e, i) => (
                <Text key={i} style={styles.dayEmoji}>{e}</Text>
              ))}
            </View>
            <View style={styles.countList}>
              {counts.map(([mood, c]) => {
                const map = MOODS.find((mm) => mm.key === mood);
                if (!map) return null;
                return (
                  <Text key={mood} style={styles.countItem}> {map.emoji} {c} {map.label} {c === 1 ? 'Day' : 'Days'}</Text>
                );
              })}
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.supportBtn} onPress={() => {}}>
          <Text style={styles.supportText}>Get Tips & Support</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <TouchableOpacity onPress={() => setRange('daily')} style={[styles.rangeBtn, range === 'daily' ? styles.rangeActive : undefined]}>
            <Text style={styles.rangeText}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRange('weekly')} style={[styles.rangeBtn, range === 'weekly' ? styles.rangeActive : undefined]}>
            <Text style={styles.rangeText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRange('monthly')} style={[styles.rangeBtn, range === 'monthly' ? styles.rangeActive : undefined]}>
            <Text style={styles.rangeText}>Monthly</Text>
          </TouchableOpacity>
        </View>

        {ChartKit ? (
          <>
            <Text style={styles.chartTitle}>Most Frequent (Pie)</Text>
            <ChartKit.PieChart data={pieFiltered.filter((d: any) => d.population > 0)} width={screenWidth} height={160} chartConfig={{ color: () => '#333' }} accessor="population" backgroundColor="transparent" paddingLeft="15" />

            <Text style={styles.chartTitle}>Recent Mood Changes</Text>
            <ChartKit.LineChart data={{ labels, datasets: [{ data: series }] }} width={screenWidth} height={140} chartConfig={{ backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', color: (opacity = 1) => `rgba(33,150,243,${opacity})` }} bezier />
          </>
        ) : (
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>Install `react-native-chart-kit` to see graphs.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 18, marginBottom: 36 },
  title: { fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.textPrimary, marginBottom: 8 },
  prompt: { fontSize: 16, color: colors.textSecondary, marginBottom: 8 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  moodBtnLarge: { paddingVertical: 8, borderRadius: 10, flexBasis: '24%', alignItems: 'center', marginBottom: 8 },
  moodEmojiLarge: { fontSize: 24 },
  moodLabel: { color: '#fff', marginTop: 4, fontSize: 11 },
  moodLabelActive: { color: '#333' },
  noteInput: { borderWidth: 1, borderColor: '#e6e6e6', padding: 10, borderRadius: 8, marginTop: 8, backgroundColor: '#fff' },
  saveBtn: { marginTop: 10, backgroundColor: '#ff8a65', paddingVertical: 12, borderRadius: 24, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  trendsWrap: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
  trendsTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  trendRow: { flexDirection: 'row', alignItems: 'center' },
  illustrationBox: { width: 96, height: 96, backgroundColor: '#fff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  trendRight: { flex: 1 },
  weekEmojisRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dayEmoji: { fontSize: 18 },
  countList: { marginTop: 6 },
  countItem: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  supportBtn: { marginTop: 12, backgroundColor: '#3CB371', paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  supportText: { color: '#fff', fontWeight: '700' },
  rangeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#f2f2f2', marginHorizontal: 6 },
  rangeActive: { backgroundColor: '#ff8a65' },
  rangeText: { color: '#333', fontWeight: '600' },
  chartTitle: { marginTop: 12, fontSize: 14, color: colors.textSecondary },
  fallback: { padding: 12, backgroundColor: '#fff3cd', borderRadius: 8, marginTop: 8 },
  fallbackText: { color: '#8a6d3b' },
});

export default MoodSummary;
