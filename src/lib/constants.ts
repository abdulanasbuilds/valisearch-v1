/**
 * ValiSearch — Application Constants
 * Centralized configuration values and magic strings
 */

// App Info
export const APP_NAME = 'ValiSearch';
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://valisearch.app';

// Analysis Configuration
export const MAX_IDEA_LENGTH = 2000;
export const MIN_IDEA_LENGTH = 10;
export const ANALYSIS_SECTIONS = [
  'overview',
  'validation',
  'market-feasibility',
  'market',
  'competitors',
  'product',
  'branding',
  'revenue',
  'monetization',
  'go-to-market',
  'evolution',
  'flow-editor',
  'user-flow',
  'kanban',
  'tech-stack',
  'build-mode',
  'ide-bridge',
  'launch-center',
] as const;

export type AnalysisSection = typeof ANALYSIS_SECTIONS[number];

// Credit System
export const FREE_CREDITS = 15;
export const PRO_CREDITS = 200;
export const PREMIUM_CREDITS = Infinity;

export const CREDIT_PACKAGES = {
  free: { credits: FREE_CREDITS, price: 0 },
  pro: { credits: PRO_CREDITS, price: 29 },
  premium: { credits: PREMIUM_CREDITS, price: 79 },
} as const;

// Rate Limiting
export const MAX_ANALYSES_PER_HOUR = 10;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// UI Constants
export const MAX_CONTENT_WIDTH = '1200px';
export const NAVBAR_HEIGHT = 64;
export const SECTION_PADDING = '100px';

// API Cache
export const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

// Score Thresholds
export const SCORE_THRESHOLDS = {
  strong: 70,
  moderate: 50,
  weak: 30,
} as const;

// Color System (matches CSS variables)
export const COLORS = {
  background: '#0A0A0A',
  surface: '#111111',
  elevated: '#1A1A1A',
  primary: '#6C47FF',
  primaryHover: '#7C5AFF',
  text: {
    primary: '#F0F0F0',
    secondary: '#888888',
    muted: '#444444',
  },
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
} as const;

// Font Families
export const FONTS = {
  sans: 'Inter, system-ui, -apple-system, sans-serif',
  serif: "'DM Serif Display', Georgia, serif",
} as const;
