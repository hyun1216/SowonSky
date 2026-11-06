export type BalloonColor = 'pink' | 'lavender' | 'sky' | 'mint' | 'yellow';

export interface Wish {
  id: string;
  content: string;
  balloonColor: BalloonColor;
  countryCode: string;
  countryName: string;
  cheerCount: number;
  createdAt: string;
}

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  englishName: string;
}

