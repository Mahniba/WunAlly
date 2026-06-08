import { BabySizeArtKey } from '../types';

export interface FruitVisual {
  emoji: string;
  /** Stable direct image URL (source.unsplash.com is deprecated and returns 503). */
  imageUrl?: string;
  artKey: BabySizeArtKey;
}

/** Normalise milestone labels to lookup keys. */
export function fruitKey(label: string): string {
  return label.trim().toLowerCase();
}

const img = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=220&h=220&q=80`;

/**
 * Curated visuals per fruit/veg comparison.
 * Emoji always works offline; imageUrl loads when the device has network.
 */
const FRUIT_VISUALS: Record<string, FruitVisual> = {
  'poppy seed': {
    emoji: '🌱',
    artKey: 'yam',
  },
  'sesame seed': {
    emoji: '🫘',
    artKey: 'yam',
  },
  lentil: {
    emoji: '🫘',
    artKey: 'yam',
  },
  blueberry: {
    emoji: '🫐',
    imageUrl: img('photo-1498557850523-fd3d118b962e'),
    artKey: 'mango',
  },
  'kidney bean': {
    emoji: '🫘',
    artKey: 'yam',
  },
  cherry: {
    emoji: '🍒',
    imageUrl: img('photo-1528821121675-b5a9f0f193cb'),
    artKey: 'mango',
  },
  strawberry: {
    emoji: '🍓',
    imageUrl: img('photo-1464967421614-b7a11bbada82'),
    artKey: 'mango',
  },
  fig: {
    emoji: '🍈',
    artKey: 'mango',
  },
  lime: {
    emoji: '🍋',
    imageUrl: img('photo-1587735241474-6edbfc0e7b66'),
    artKey: 'mango',
  },
  'pea pod': {
    emoji: '🫛',
    artKey: 'mango',
  },
  lemon: {
    emoji: '🍋',
    imageUrl: img('photo-1587735241474-6edbfc0e7b66'),
    artKey: 'mango',
  },
  apple: {
    emoji: '🍎',
    imageUrl: img('photo-1560806887-1e4cd0b6cbd6'),
    artKey: 'mango',
  },
  avocado: {
    emoji: '🥑',
    imageUrl: img('photo-1523049673857-eb18c1c2d4a1'),
    artKey: 'mango',
  },
  turnip: {
    emoji: '🥬',
    artKey: 'yam',
  },
  'bell pepper': {
    emoji: '🫑',
    imageUrl: img('photo-1563568820624-4d4c36caa12b'),
    artKey: 'banana',
  },
  'heirloom tomato': {
    emoji: '🍅',
    artKey: 'mango',
  },
  banana: {
    emoji: '🍌',
    imageUrl: img('photo-1571771894821-ce9b6c11b08e'),
    artKey: 'banana',
  },
  carrot: {
    emoji: '🥕',
    imageUrl: img('photo-1447173557529-0980c902e42a'),
    artKey: 'banana',
  },
  papaya: {
    emoji: '🍈',
    artKey: 'mango',
  },
  mango: {
    emoji: '🥭',
    imageUrl: img('photo-1553277194-6039e8f226e4'),
    artKey: 'mango',
  },
  corn: {
    emoji: '🌽',
    imageUrl: img('photo-1551756758-080e02d0e1b9'),
    artKey: 'banana',
  },
  cauliflower: {
    emoji: '🥦',
    imageUrl: img('photo-1518977917-fdb713d8dc96'),
    artKey: 'coconut',
  },
  scallion: {
    emoji: '🧅',
    artKey: 'yam',
  },
  rutabaga: {
    emoji: '🥔',
    artKey: 'yam',
  },
  eggplant: {
    emoji: '🍆',
    imageUrl: img('photo-1563568820624-4d4c36caa12b'),
    artKey: 'coconut',
  },
  'butternut squash': {
    emoji: '🎃',
    imageUrl: img('photo-1509488665-585c65e1c4d0'),
    artKey: 'coconut',
  },
  cabbage: {
    emoji: '🥬',
    imageUrl: img('photo-1518977917-fdb713d8dc96'),
    artKey: 'coconut',
  },
  coconut: {
    emoji: '🥥',
    imageUrl: img('photo-1582285780042-4502b9ae7c2b'),
    artKey: 'coconut',
  },
  jicama: {
    emoji: '🥔',
    artKey: 'coconut',
  },
  pineapple: {
    emoji: '🍍',
    imageUrl: img('photo-1550250952-6b9082f0f0b2'),
    artKey: 'mango',
  },
  cantaloupe: {
    emoji: '🍈',
    artKey: 'watermelon',
  },
  'honeydew melon': {
    emoji: '🍈',
    artKey: 'watermelon',
  },
  'romaine lettuce': {
    emoji: '🥬',
    artKey: 'watermelon',
  },
  'swiss chard': {
    emoji: '🥬',
    artKey: 'yam',
  },
  leek: {
    emoji: '🧅',
    artKey: 'banana',
  },
  'mini watermelon': {
    emoji: '🍉',
    imageUrl: img('photo-1587049350855-d970e7e9b0d0'),
    artKey: 'watermelon',
  },
  pumpkin: {
    emoji: '🎃',
    imageUrl: img('photo-1509488665-585c65e1c4d0'),
    artKey: 'watermelon',
  },
  newborn: {
    emoji: '👶',
    artKey: 'pregnant',
  },
};

const DEFAULT_VISUAL: FruitVisual = {
  emoji: '🍎',
  artKey: 'mango',
};

export function getFruitVisual(fruitComparison: string): FruitVisual {
  return FRUIT_VISUALS[fruitKey(fruitComparison)] ?? DEFAULT_VISUAL;
}

/** e.g. "Apple" → "an apple", "Banana" → "a banana" */
export function formatFruitSizePhrase(fruitComparison: string): string {
  const label = fruitComparison.trim().toLowerCase();
  if (!label) return 'a small fruit';
  const article = /^[aeiou]/.test(label) ? 'an' : 'a';
  return `${article} ${label}`;
}
