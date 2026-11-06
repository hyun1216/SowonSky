export type BalloonColorKey = 'pink' | 'lavender' | 'sky' | 'mint' | 'yellow';

export interface BalloonColorOption {
  key: BalloonColorKey;
  name: string;
  hex: string;
  bgClass: string;
  borderClass: string;
  glowClass: string;
  textClass: string;
}

export interface Wish {
  id: string;
  content: string;
  balloon_color: string; // hex color e.g. '#F472B6'
  country_code: string;
  country_name: string;
  cheer_count: number;
  created_at: string; // ISO 8601 string
}

export interface WishWithTimer extends Wish {
  remainingSeconds: number;
  remainingTimeFormatted: string; // "hh:mm:ss"
  isExpired: boolean;
}

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  englishName: string;
}

export interface CreateWishInput {
  content: string;
  balloon_color: string;
  country_code: string;
  country_name: string;
}
