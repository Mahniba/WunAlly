import milestones from '../data/pregnancy_milestones.json';
import { PregnancyMilestone } from '../types';
import { formatFruitSizePhrase, getFruitVisual, FruitVisual } from './fruitVisuals';

const byWeek = new Map<number, PregnancyMilestone>(
  (milestones as PregnancyMilestone[]).map((m) => [m.week, m]),
);

export function getMilestoneForWeek(week: number): PregnancyMilestone | null {
  const w = Math.max(1, Math.min(42, Math.floor(week)));
  return byWeek.get(w) ?? null;
}

export function getMilestoneVisual(week: number): FruitVisual & { fruitComparison: string } {
  const milestone = getMilestoneForWeek(week);
  const fruitComparison = milestone?.fruit_comparison ?? 'fruit';
  const visual = getFruitVisual(fruitComparison);
  return { ...visual, fruitComparison };
}

export function getMilestoneBabySize(week: number): string {
  const milestone = getMilestoneForWeek(week);
  if (!milestone) return 'a small fruit';
  return formatFruitSizePhrase(milestone.fruit_comparison);
}

export function formatMilestoneMeasurements(milestone: PregnancyMilestone): string | null {
  const { length_cm, weight_grams } = milestone;
  const hasLength = length_cm > 0;
  const hasWeight = weight_grams >= 1;

  if (!hasLength && !hasWeight) return null;

  const parts: string[] = [];
  if (hasLength) {
    parts.push(`${length_cm < 1 ? length_cm.toFixed(1) : Math.round(length_cm)} cm long`);
  }
  if (hasWeight) {
    const weight =
      weight_grams >= 1000
        ? `${(weight_grams / 1000).toFixed(1)} kg`
        : `${Math.round(weight_grams)} g`;
    parts.push(`${weight}`);
  }
  return parts.join(' · ');
}

export function getAllMilestones(): PregnancyMilestone[] {
  return milestones as PregnancyMilestone[];
}
