import type { ThemeId } from '../types';

export interface StoreTheme {
  id: ThemeId;
  name: string;
  description: string;
  premium: boolean;
  /** Storefront accent used for prices, buttons and badges. */
  accent: string;
  accentSoft: string;
  accentText: string;
  /** Page surface behind the catalogue. */
  surface: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  headerBg: string;
}

export const storeThemes: Record<ThemeId, StoreTheme> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    description: 'Clair, frais et commercial. Le thème par défaut SELLIA.',
    premium: false,
    accent: '#10a05c',
    accentSoft: '#e8f7ef',
    accentText: '#ffffff',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#0f1a15',
    muted: '#6b7a72',
    border: '#e8ebe9',
    headerBg: 'rgba(255,255,255,0.88)'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Sombre et premium. Idéal pour sneakers et streetwear.',
    premium: true,
    accent: '#4ade80',
    accentSoft: '#14261d',
    accentText: '#07140d',
    surface: '#0c0f0e',
    card: '#151918',
    text: '#f4f6f5',
    muted: '#9aa4a0',
    border: '#232827',
    headerBg: 'rgba(12,15,14,0.9)'
  },
  sand: {
    id: 'sand',
    name: 'Sand',
    description: 'Chaleureux et éditorial. Parfait pour la mode et la beauté.',
    premium: true,
    accent: '#a4562a',
    accentSoft: '#f7ece3',
    accentText: '#ffffff',
    surface: '#fbf7f3',
    card: '#ffffff',
    text: '#241a14',
    muted: '#7a6a5e',
    border: '#ece2d8',
    headerBg: 'rgba(251,247,243,0.9)'
  },
  coral: {
    id: 'coral',
    name: 'Coral',
    description: 'Vif et énergique. Pensé pour la restauration et le food.',
    premium: true,
    accent: '#e2483d',
    accentSoft: '#fdecea',
    accentText: '#ffffff',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#1c1210',
    muted: '#7d6b68',
    border: '#efe6e4',
    headerBg: 'rgba(255,255,255,0.88)'
  },
  noir: {
    id: 'noir',
    name: 'Noir Gold',
    description: 'Noir profond et touches dorées pour une allure luxueuse.',
    premium: true,
    accent: '#d2ad5b',
    accentSoft: '#2b261b',
    accentText: '#11100d',
    surface: '#0b0b0b',
    card: '#151515',
    text: '#f7f3e9',
    muted: '#aaa49a',
    border: '#2b2a27',
    headerBg: 'rgba(11,11,11,0.92)'
  },
  royal: {
    id: 'royal',
    name: 'Royal Blue',
    description: 'Bleu affirmé et surfaces nettes pour la tech et les services.',
    premium: true,
    accent: '#2459d3',
    accentSoft: '#e8efff',
    accentText: '#ffffff',
    surface: '#f8faff',
    card: '#ffffff',
    text: '#111827',
    muted: '#667085',
    border: '#dce3f0',
    headerBg: 'rgba(248,250,255,0.92)'
  },
  rose: {
    id: 'rose',
    name: 'Rose Atelier',
    description: 'Rose raffiné et contrastes doux pour beauté et créations.',
    premium: true,
    accent: '#b93662',
    accentSoft: '#fae7ee',
    accentText: '#ffffff',
    surface: '#fff9fb',
    card: '#ffffff',
    text: '#2b171e',
    muted: '#806872',
    border: '#efdae2',
    headerBg: 'rgba(255,249,251,0.92)'
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic',
    description: 'Minimal, calme et précis pour maison, artisanat et bien-être.',
    premium: true,
    accent: '#17756d',
    accentSoft: '#dfefeb',
    accentText: '#ffffff',
    surface: '#f4f7f6',
    card: '#ffffff',
    text: '#172320',
    muted: '#697975',
    border: '#d9e2df',
    headerBg: 'rgba(244,247,246,0.92)'
  }
};

export function getTheme(id: ThemeId): StoreTheme {
  return storeThemes[id] ?? storeThemes.emerald;
}

export function isPremiumTheme(id: ThemeId): boolean {
  return getTheme(id).premium;
}
