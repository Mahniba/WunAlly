import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSymptomsStore } from '../store/useSymptomsStore';
import { colors } from '../theme';

const { width } = Dimensions.get('window');

export function SymptomsChart({ days = 14 }: { days?: number }) {
  const entries = useSymptomsStore((s) => s.entries);

  // build labels and counts for last `days` days
  const labels: string[] = [];
  const nauseaData: number[] = [];
  const headacheData: number[] = [];
  const dizzyData: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayKey = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
    const dayEntries = entries.filter((e) => e.date.slice(0, 10) === dayKey);
    nauseaData.push(dayEntries.filter((e) => e.symptoms.nausea).length);
    headacheData.push(dayEntries.filter((e) => e.symptoms.headache).length);
    dizzyData.push(dayEntries.filter((e) => e.symptoms.dizzy).length);
  }

  const maxY = Math.max(...nauseaData, ...headacheData, ...dizzyData, 1);

  return (
    <View>
      <Text style={{ color: colors.textPrimary, fontWeight: '600', marginBottom: 8 }}>Symptoms (last {days} days)</Text>
      <LineChart
        data={{
          labels,
          datasets: [
            { data: nauseaData, color: () => '#FF8A65', strokeWidth: 2, label: 'Nausea' },
            { data: headacheData, color: () => '#4FC3F7', strokeWidth: 2, label: 'Headache' },
            { data: dizzyData, color: () => '#A1887F', strokeWidth: 2, label: 'Dizzy' },
          ],
          legend: ['Nausea', 'Headache', 'Dizzy'],
        }}
        width={Math.min(width - 40, 760)}
        height={220}
        yAxisSuffix=""
        fromZero
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          propsForDots: { r: '3' },
        }}
        bezier
        style={{ borderRadius: 12 }}
        segments={Math.max(2, maxY)}
      />
    </View>
  );
}
