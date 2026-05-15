import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSymptomsStore } from '../store/useSymptomsStore';
import { useContentStore } from '../store/useContentStore';
import { colors, typography } from '../theme';

const CHART_COLORS = [colors.coral, colors.lavenderDark, colors.textMuted, colors.moodHappy, colors.moodAnxious];

function labelForKey(key: string, catalogs: Record<string, { key: string; label: string }[]>): string {
  for (const list of Object.values(catalogs)) {
    const found = list.find((s) => s.key === key);
    if (found) return found.label;
  }
  return key.replace(/_/g, ' ');
}

export function SymptomsChart({ days = 14 }: { days?: number }) {
  const { width } = useWindowDimensions();
  const entries = useSymptomsStore((s) => s.entries);
  const hydrate = useSymptomsStore((s) => s.hydrate);
  const catalogs = useContentStore((s) => s.content.symptom_catalogs);
  const hydrateContent = useContentStore((s) => s.hydrate);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    hydrate();
    hydrateContent();
  }, [hydrate, hydrateContent]);

  const topKeys = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries ?? []) {
      for (const [key, active] of Object.entries(entry.symptoms ?? {})) {
        if (active) counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key]) => key);
  }, [entries]);

  const available = containerWidth ?? Math.min(width - 32, 760);
  const chartWidth = Math.min(Math.max(280, available - 8), 760);

  const { labels, datasets, hasAnyData } = useMemo(() => {
    const lbls: string[] = [];
    const series = topKeys.map(() => [] as number[]);
    const step = Math.max(1, Math.ceil(days / 6));

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().slice(0, 10);
      const dayEntries = (entries ?? []).filter((e) => e.date.slice(0, 10) === dayKey);
      topKeys.forEach((key, idx) => {
        series[idx].push(dayEntries.filter((e) => e.symptoms?.[key]).length);
      });
      lbls.push(i % step === 0 ? `${d.getDate()}` : '');
    }

    const chartDatasets = topKeys.map((key, idx) => ({
      data: series[idx],
      color: () => CHART_COLORS[idx % CHART_COLORS.length],
      strokeWidth: 2,
    }));

    const any = series.some((s) => s.some((v) => v > 0));
    return { labels: lbls, datasets: chartDatasets, hasAnyData: any };
  }, [days, entries, topKeys]);

  if (!entries || entries.length === 0 || !hasAnyData) {
    return (
      <View
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        style={{ width: '100%', alignItems: 'center' }}
      >
        <View style={{ width: '100%' }}>
          <Text style={{ color: colors.textPrimary, fontWeight: typography.weights.semibold, marginBottom: 6 }}>
            Symptoms (last {days} days)
          </Text>
          <Text style={{ color: colors.textSecondary, lineHeight: 20 }}>
            No symptom history yet. Use the Check-In tab to start tracking.
          </Text>
        </View>
      </View>
    );
  }

  const flat = datasets.flatMap((d) => d.data);
  const maxY = Math.max(...flat, 1);

  return (
    <View
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      style={{ width: '100%', alignItems: 'center' }}
    >
      <View style={{ width: '100%' }}>
        <Text style={{ color: colors.textPrimary, fontWeight: typography.weights.semibold, marginBottom: 8 }}>
          Symptoms (last {days} days)
        </Text>
        <View style={{ flexDirection: 'row', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
          {topKeys.map((key, idx) => (
            <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
              <Text style={{ color: CHART_COLORS[idx % CHART_COLORS.length], fontWeight: typography.weights.bold }}>
                ●
              </Text>
              <Text style={{ color: colors.textSecondary, marginLeft: 4 }}>{labelForKey(key, catalogs)}</Text>
            </View>
          ))}
        </View>
      </View>
      <LineChart
        data={{ labels, datasets }}
        width={chartWidth}
        height={240}
        yAxisSuffix=""
        fromZero
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(45,42,43,${opacity})`,
          labelColor: (opacity = 1) => `rgba(92,86,88,${opacity})`,
          propsForBackgroundLines: { stroke: colors.border },
          propsForDots: { r: '3', strokeWidth: '1', stroke: colors.surface },
        }}
        bezier
        style={{ borderRadius: 12, alignSelf: 'center' }}
        segments={Math.max(2, maxY)}
      />
    </View>
  );
}
