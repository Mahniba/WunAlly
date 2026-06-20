import React from 'react';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Polygon,
  Rect,
} from 'react-native-svg';

type IconProps = { size?: number };

function wrap(
  bg: string,
  render: (size: number) => React.ReactElement
): { bg: string; render: (size: number) => React.ReactElement } {
  return { bg, render };
}

const ICONS: Record<string, { bg: string; render: (size: number) => React.ReactElement }> = {
  swelling: wrap('#FFF3E0', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="20" rx="10" ry="6" fill="#FFAB40" opacity={0.3} />
      <Path
        d="M8 20 Q6 14 10 10 Q12 7 14 8 Q16 7 18 10 Q22 14 20 20"
        fill="#FF8A65"
        opacity={0.85}
      />
      <Path d="M10 18 Q9 15 11 13" stroke="#BF360C" strokeWidth={1.2} strokeLinecap="round" />
      <Circle cx="17" cy="13" r="2.5" fill="#FFCCBC" opacity={0.6} />
    </Svg>
  )),
  heartburn: wrap('#FFF8E1', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="17" rx="8" ry="7" fill="#FFCC80" opacity={0.5} />
      <Path
        d="M10 22 Q8 18 9 14 Q10 10 14 10 Q18 10 19 14 Q20 18 18 22"
        fill="#FFB74D"
        opacity={0.7}
      />
      <Path
        d="M13 22 L15 16 L12 16 L15 10"
        stroke="#E65100"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )),
  constipation: wrap('#F3E5F5', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="9" fill="#CE93D8" opacity={0.3} />
      <Path d="M9 14 Q9 9 14 9 Q19 9 19 14 L18 20 Q14 22 10 20 Z" fill="#AB47BC" opacity={0.6} />
      <Circle cx="11" cy="13" r="1.5" fill="#6A1B9A" opacity={0.5} />
      <Circle cx="17" cy="13" r="1.5" fill="#6A1B9A" opacity={0.5} />
      <Path d="M11 17 Q14 19 17 17" stroke="#6A1B9A" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  )),
  stretch_marks: wrap('#E8EAF6', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="14" rx="10" ry="12" fill="#9FA8DA" opacity={0.25} />
      <Path d="M10 8 Q12 14 10 20" stroke="#7986CB" strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M14 7 Q16 14 14 21" stroke="#5C6BC0" strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M18 9 Q16 15 18 20" stroke="#7986CB" strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  )),
  back_pain: wrap('#E8F5E9', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="22" rx="8" ry="3" fill="#A5D6A7" opacity={0.4} />
      <Path d="M14 6 Q10 10 10 16 Q10 20 14 22 Q18 20 18 16 Q18 10 14 6Z" fill="#66BB6A" opacity={0.5} />
      <Path d="M14 8 L14 20" stroke="#2E7D32" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M11 12 L17 12 M11 16 L17 16" stroke="#2E7D32" strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  )),
  nausea: wrap('#E8F5E9', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="17" rx="9" ry="8" fill="#A5D6A7" opacity={0.4} />
      <Path d="M8 18 Q8 12 14 11 Q20 12 20 18 Q20 22 14 23 Q8 22 8 18Z" fill="#66BB6A" opacity={0.5} />
      <Path d="M11 16 Q14 20 17 16" stroke="#2E7D32" strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M14 11 L12 8 Q11 6 13 5 Q15 6 14 8Z" fill="#43A047" opacity={0.6} />
    </Svg>
  )),
  headache: wrap('#FFF3E0', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="15" r="9" fill="#FFCC80" opacity={0.35} />
      <Path d="M8 15 Q8 9 14 8 Q20 9 20 15 Q20 20 14 21 Q8 20 8 15Z" fill="#FFA726" opacity={0.45} />
      <Path d="M10 12 Q14 10 18 12" stroke="#E65100" strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M14 8 L13 5 M14 8 L15 5" stroke="#FF8F00" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  )),
  dizzy: wrap('#E8EAF6', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="9" fill="#9FA8DA" opacity={0.3} />
      <Path d="M6 14 Q10 8 18 10 Q22 14 18 20 Q10 22 6 14Z" fill="#7986CB" opacity={0.35} />
      <Circle cx="14" cy="14" r="2" fill="#3949AB" opacity={0.6} />
      <Path d="M8 10 Q11 7 14 9" stroke="#9FA8DA" strokeWidth={1} strokeLinecap="round" />
    </Svg>
  )),
  fatigue: wrap('#E3F2FD', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="9" fill="#90CAF9" opacity={0.3} />
      <Path d="M8 18 Q8 10 14 10 Q20 10 20 18" fill="#42A5F5" opacity={0.4} />
      <Path d="M10 14 L14 14 L14 18" stroke="#0D47A1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 10 L5 8 M21 10 L23 8 M14 7 L14 5" stroke="#64B5F6" strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  )),
  strong_kicks: wrap('#E8F5E9', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="16" rx="9" ry="10" fill="#A5D6A7" opacity={0.35} />
      <Circle cx="14" cy="13" r="5" fill="#66BB6A" opacity={0.4} />
      <Path d="M10 17 Q14 22 18 17" stroke="#2E7D32" strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M18 10 L22 8 M20 13 L24 13" stroke="#43A047" strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  )),
  reduced_baby_movement: wrap('#FFF3E0', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="16" rx="9" ry="10" fill="#FFCC80" opacity={0.35} />
      <Circle cx="14" cy="13" r="5" fill="#FFA726" opacity={0.4} />
      <Path d="M10 17 Q14 15 18 17" stroke="#E65100" strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M18 10 L20 9" stroke="#FF8F00" strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  )),
  irregular_pattern: wrap('#E3F2FD', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="16" rx="9" ry="10" fill="#90CAF9" opacity={0.35} />
      <Circle cx="14" cy="13" r="5" fill="#42A5F5" opacity={0.4} />
      <Path d="M10 13 Q12 16 14 13 Q16 10 18 13" stroke="#0D47A1" strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  )),
  normal_discharge: wrap('#E8F5E9', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M14 6 Q10 11 10 16 Q10 21 14 22 Q18 21 18 16 Q18 11 14 6Z" fill="#A5D6A7" opacity={0.6} />
      <Path d="M14 9 Q12 13 12 16" stroke="#2E7D32" strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
    </Svg>
  )),
  unusual_discharge: wrap('#FFF9C4', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M14 6 Q10 11 10 16 Q10 21 14 22 Q18 21 18 16 Q18 11 14 6Z" fill="#FFF176" opacity={0.7} />
      <Path d="M14 12 L14 17" stroke="#F57F17" strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="14" cy="20" r="1.2" fill="#F57F17" />
    </Svg>
  )),
  itching: wrap('#FCE4EC', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="9" fill="#F48FB1" opacity={0.3} />
      <Path d="M10 10 Q14 8 18 10 Q20 14 18 18 Q14 20 10 18 Q8 14 10 10Z" fill="#E91E63" opacity={0.3} />
      <Path d="M11 12 Q13 10 15 12 M11 16 Q13 14 15 16" stroke="#880E4F" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  )),
  odor: wrap('#FFF3E0', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="9" fill="#FFCC80" opacity={0.35} />
      <Path d="M14 8 Q10 12 10 16 Q10 20 14 20 Q18 20 18 16 Q18 12 14 8Z" fill="#FFB74D" opacity={0.5} />
      <Path d="M14 6 Q12 4 14 2 Q16 4 14 6" stroke="#E65100" strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M16 5 Q18 3 17 1" stroke="#FF8F00" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
    </Svg>
  )),
  vaginal_bleeding: wrap('#FFEBEE', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M14 6 Q10 12 10 17 Q10 22 14 23 Q18 22 18 17 Q18 12 14 6Z" fill="#EF5350" opacity={0.6} />
      <Path d="M14 10 Q12 14 12 17" stroke="#B71C1C" strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  )),
  severe_abdominal_pain: wrap('#FFF3E0', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Polygon points="14,5 25,22 3,22" fill="#FF7043" opacity={0.4} />
      <Polygon points="14,6 24,21 4,21" fill="none" stroke="#E64A19" strokeWidth={1.2} />
      <Path d="M14 12 L14 17" stroke="#BF360C" strokeWidth={2} strokeLinecap="round" />
      <Circle cx="14" cy="20" r="1.2" fill="#BF360C" />
    </Svg>
  )),
  swelling_face_hands_feet: wrap('#FCE4EC', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="9" fill="#F48FB1" opacity={0.35} />
      <Ellipse cx="14" cy="14" rx="7" ry="5" fill="#E91E63" opacity={0.35} />
      <Circle cx="10" cy="13" r="2" fill="#AD1457" opacity={0.5} />
      <Circle cx="18" cy="13" r="2" fill="#AD1457" opacity={0.5} />
      <Path d="M10 17 Q14 19 18 17" stroke="#880E4F" strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  )),
  blurred_vision: wrap('#E8EAF6', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="14" rx="10" ry="7" fill="#9FA8DA" opacity={0.3} />
      <Path d="M4 14 Q9 8 14 8 Q19 8 24 14 Q19 20 14 20 Q9 20 4 14Z" fill="#7986CB" opacity={0.35} />
      <Circle cx="14" cy="14" r="4" fill="#3F51B5" opacity={0.4} />
      <Circle cx="14" cy="14" r="2" fill="#1A237E" opacity={0.6} />
      <Path d="M20 8 L22 6 M22 8 L20 6" stroke="#E64A19" strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  )),
  severe_headache: wrap('#FFF3E0', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="9" fill="#FF7043" opacity={0.35} />
      <Path d="M8 14 Q8 8 14 7 Q20 8 20 14 Q20 19 14 20 Q8 19 8 14Z" fill="#FF5722" opacity={0.45} />
      <Path d="M10 11 Q14 9 18 11" stroke="#BF360C" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M14 5 L13 2 M14 5 L15 2 M14 5 L14 3" stroke="#E64A19" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  )),
  fever: wrap('#FFEBEE', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="11" y="6" width="6" height="16" rx="3" fill="#EF5350" opacity={0.5} />
      <Circle cx="14" cy="20" r="4" fill="#E53935" opacity={0.6} />
      <Path d="M14 9 L14 17" stroke="#B71C1C" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="14" cy="12" r="1.5" fill="#FFCDD2" />
      <Circle cx="14" cy="15" r="1.5" fill="#FFCDD2" />
    </Svg>
  )),
  severe_vomiting: wrap('#E8F5E9', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="17" rx="9" ry="8" fill="#A5D6A7" opacity={0.4} />
      <Path d="M8 18 Q8 12 14 11 Q20 12 20 18" fill="#66BB6A" opacity={0.5} />
      <Path d="M11 16 Q14 21 17 16" stroke="#2E7D32" strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M12 8 Q14 4 16 8" stroke="#43A047" strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  )),
  dizziness: wrap('#E8EAF6', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="9" fill="#9FA8DA" opacity={0.3} />
      <Path d="M6 14 Q10 8 18 10 Q22 14 18 20 Q10 22 6 14Z" fill="#7986CB" opacity={0.35} />
      <Circle cx="14" cy="14" r="2" fill="#3949AB" opacity={0.6} />
    </Svg>
  )),
  insomnia: wrap('#EDE7F6', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M16 6 Q10 8 10 14 Q10 20 16 22 Q12 18 12 14 Q12 10 16 6Z" fill="#9575CD" opacity={0.5} />
      <Circle cx="20" cy="8" r="1.5" fill="#CE93D8" />
      <Circle cx="22" cy="12" r="1" fill="#CE93D8" opacity={0.7} />
    </Svg>
  )),
  foul_discharge: wrap('#FFF9C4', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M14 6 Q10 11 10 16 Q10 21 14 22 Q18 21 18 16 Q18 11 14 6Z" fill="#FFF176" opacity={0.7} />
      <Path d="M14 6 Q12 4 14 2 Q16 4 14 6" stroke="#F57F17" strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M16 4 Q18 2 17 0" stroke="#FF8F00" strokeWidth={1} strokeLinecap="round" />
    </Svg>
  )),
  difficulty_breathing: wrap('#E3F2FD', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="15" rx="8" ry="6" fill="#90CAF9" opacity={0.35} />
      <Path d="M10 15 Q14 10 18 15 Q14 20 10 15Z" fill="#42A5F5" opacity={0.4} />
      <Path d="M6 15 Q10 12 14 15 M18 15 Q22 12 24 15" stroke="#1565C0" strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  )),
  happy: wrap('#FFFDE7', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="10" fill="#FFF176" opacity={0.5} />
      <Circle cx="14" cy="14" r="7" fill="#FFD600" opacity={0.5} />
      <Circle cx="11" cy="12" r="1.5" fill="#F57F17" />
      <Circle cx="17" cy="12" r="1.5" fill="#F57F17" />
      <Path d="M10 16 Q14 20 18 16" stroke="#F57F17" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )),
  ok: wrap('#F3E5F5', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="10" fill="#CE93D8" opacity={0.35} />
      <Circle cx="14" cy="13" r="6" fill="#AB47BC" opacity={0.4} />
      <Circle cx="11" cy="12" r="1.5" fill="#6A1B9A" />
      <Circle cx="17" cy="12" r="1.5" fill="#6A1B9A" />
      <Path d="M11 16 Q14 16 17 16" stroke="#6A1B9A" strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  )),
  sad: wrap('#E3F2FD', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="10" fill="#90CAF9" opacity={0.35} />
      <Circle cx="14" cy="13" r="6" fill="#42A5F5" opacity={0.4} />
      <Circle cx="11" cy="11" r="1.5" fill="#0D47A1" />
      <Circle cx="17" cy="11" r="1.5" fill="#0D47A1" />
      <Path d="M10 17 Q14 15 18 17" stroke="#1565C0" strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M11 14 Q11 16 10 17 M17 14 Q17 16 18 17" stroke="#42A5F5" strokeWidth={1} strokeLinecap="round" />
    </Svg>
  )),
  anxious: wrap('#FFF3E0', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="10" fill="#FFCC80" opacity={0.35} />
      <Circle cx="14" cy="13" r="6" fill="#FFA726" opacity={0.5} />
      <Circle cx="11" cy="12" r="1.5" fill="#E65100" />
      <Circle cx="17" cy="12" r="1.5" fill="#E65100" />
      <Path d="M11 17 Q14 15 17 17" stroke="#E65100" strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M10 9 Q14 7 18 9" stroke="#FF8F00" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  )),
  stressed: wrap('#FCE4EC', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="10" fill="#F48FB1" opacity={0.35} />
      <Circle cx="14" cy="13" r="6" fill="#EC407A" opacity={0.4} />
      <Circle cx="11" cy="12" r="1.5" fill="#880E4F" />
      <Circle cx="17" cy="12" r="1.5" fill="#880E4F" />
      <Path d="M10 17 Q14 14 18 17" stroke="#C2185B" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M10 9 Q12 11 14 9 M14 9 Q16 11 18 9" stroke="#C2185B" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  )),
  tired: wrap('#E3F2FD', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="10" fill="#90CAF9" opacity={0.35} />
      <Circle cx="14" cy="13" r="6" fill="#42A5F5" opacity={0.4} />
      <Path d="M9 13 L19 13" stroke="#1565C0" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M10 16 Q14 14 18 16" stroke="#1565C0" strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  )),
  sleepy: wrap('#EDE7F6', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="10" fill="#CE93D8" opacity={0.35} />
      <Circle cx="14" cy="13" r="6" fill="#9C27B0" opacity={0.35} />
      <Path d="M9 13 L19 13" stroke="#6A1B9A" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M18 8 L20 6 M20 10 L22 8" stroke="#AB47BC" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  )),
  confused: wrap('#E8EAF6', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="10" fill="#9FA8DA" opacity={0.35} />
      <Circle cx="14" cy="13" r="6" fill="#7986CB" opacity={0.4} />
      <Circle cx="11" cy="12" r="1.5" fill="#3949AB" />
      <Circle cx="17" cy="12" r="1.5" fill="#3949AB" />
      <Path d="M11 17 Q14 15 17 17" stroke="#3949AB" strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M14 8 Q16 6 14 4" stroke="#5C6BC0" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  )),
  none_today: wrap('#FCE4EC', (size) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#F48FB1"
        opacity={0.7}
      />
    </Svg>
  )),
  default: wrap('#FFF0E8', (size) => (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="9" fill="#FFCCBC" opacity={0.5} />
      <Circle cx="14" cy="14" r="4" fill="#E8735A" opacity={0.6} />
    </Svg>
  )),
};

export function CheckInIcon({ iconKey, size = 28 }: IconProps & { iconKey: string }) {
  const def = ICONS[iconKey] ?? ICONS.default;
  return def.render(size);
}

export function iconBgFor(iconKey: string): string {
  return (ICONS[iconKey] ?? ICONS.default).bg;
}
