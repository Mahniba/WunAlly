import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSymptomsStore } from '../store/useSymptomsStore';
import { colors, typography } from '../theme';
import { SecondaryButton } from './SecondaryButton';

export function SymptomsChart({ days = 14 }: { days?: number }) {
  const { width } = useWindowDimensions();
  const entries = useSymptomsStore((s) => s.entries);
  const hydrate = useSymptomsStore((s) => s.hydrate);
  const addEntry = useSymptomsStore((s) => s.addEntry);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const available = containerWidth ?? Math.min(width - 32, 760);
  // Keep a small inner gutter so the chart doesn't touch card edges.
  const chartWidth = Math.min(Math.max(280, available - 8), 760);

  const { labels, nauseaData, headacheData, dizzyData } = useMemo(() => {
    const lbls: string[] = [];
    const nausea: number[] = [];
    const headache: number[] = [];
    const dizzy: number[] = [];

    // Reduce x-axis crowding: show ~6 labels max
    const step = Math.max(1, Math.ceil(days / 6));

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().slice(0, 10);
      const dayEntries = (entries ?? []).filter((e) => e.date.slice(0, 10) === dayKey);
      nausea.push(dayEntries.filter((e) => e.symptoms.nausea).length);
      headache.push(dayEntries.filter((e) => e.symptoms.headache).length);
      dizzy.push(dayEntries.filter((e) => e.symptoms.dizzy).length);

      // Keep labels short to avoid shrinking
      const dayLabel = `${d.getDate()}`;
      lbls.push(i % step === 0 ? dayLabel : '');
    }

    return { labels: lbls, nauseaData: nausea, headacheData: headache, dizzyData: dizzy };
  }, [days, entries]);

  const hasAnyData = nauseaData.some((n) => n > 0) || headacheData.some((n) => n > 0) || dizzyData.some((n) => n > 0);

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
          <SecondaryButton
            title="Generate sample data"
            onPress={() => {
              // Local-only demo data (does not call any backend).
              const now = new Date();
              for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                addEntry({
                  date: d.toISOString(),
                  symptoms: {
                    nausea: i % 3 === 0,
                    headache: i % 4 === 0,
                    dizzy: i % 5 === 0,
                  },
                  sleepHours: 6 + ((i * 7) % 3),
                  painLevel: (i % 4) + 1,
                  foodNote: i % 2 === 0 ? 'Small meals + water' : undefined,
                });
              }
            }}
            style={{ marginTop: 12 }}
          />
        </View>
      </View>
    );
  }

  const maxY = Math.max(...nauseaData, ...headacheData, ...dizzyData, 1);

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
          <Text style={{ color: colors.coral, fontWeight: typography.weights.bold }}>●</Text>
          <Text style={{ color: colors.textSecondary, marginRight: 6 }}>Nausea</Text>
          <Text style={{ color: colors.lavenderDark, fontWeight: typography.weights.bold }}>●</Text>
          <Text style={{ color: colors.textSecondary, marginRight: 6 }}>Headache</Text>
          <Text style={{ color: colors.textMuted, fontWeight: typography.weights.bold }}>●</Text>
          <Text style={{ color: colors.textSecondary }}>Dizzy</Text>
        </View>
      </View>
      <LineChart
        data={{
          labels,
          datasets: [
            { data: nauseaData, color: () => colors.coral, strokeWidth: 2 },
            { data: headacheData, color: () => colors.lavenderDark, strokeWidth: 2 },
            { data: dizzyData, color: () => colors.textMuted, strokeWidth: 2 },
          ],
        }}
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
          propsForBackgroundLines: {
            stroke: colors.border,
          },
          propsForDots: { r: '3', strokeWidth: '1', stroke: colors.surface },
        }}
        bezier
        style={{ borderRadius: 12, alignSelf: 'center' }}
        segments={Math.max(2, maxY)}
      />
    </View>
  );
}
