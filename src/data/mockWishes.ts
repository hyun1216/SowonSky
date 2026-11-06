import { Wish, BalloonColorKey, BalloonColorOption, CountryInfo } from '../types/wish';

export const BALLOON_PALETTE: BalloonColorOption[] = [
  {
    key: 'pink',
    name: '소프트 핑크',
    hex: '#F472B6',
    bgClass: 'bg-pink-400/80',
    borderClass: 'border-pink-300',
    glowClass: 'shadow-[0_0_20px_rgba(244,114,182,0.6)]',
    textClass: 'text-pink-300',
  },
  {
    key: 'lavender',
    name: '라벤더',
    hex: '#A78BFA',
    bgClass: 'bg-purple-400/80',
    borderClass: 'border-purple-300',
    glowClass: 'shadow-[0_0_20px_rgba(167,139,250,0.6)]',
    textClass: 'text-purple-300',
  },
  {
    key: 'sky',
    name: '스카이블루',
    hex: '#38BDF8',
    bgClass: 'bg-sky-400/80',
    borderClass: 'border-sky-300',
    glowClass: 'shadow-[0_0_20px_rgba(56,189,248,0.6)]',
    textClass: 'text-sky-300',
  },
  {
    key: 'mint',
    name: '민트',
    hex: '#34D399',
    bgClass: 'bg-emerald-400/80',
    borderClass: 'border-emerald-300',
    glowClass: 'shadow-[0_0_20px_rgba(52,211,153,0.6)]',
    textClass: 'text-emerald-300',
  },
  {
    key: 'yellow',
    name: '파스텔 옐로우',
    hex: '#FCD34D',
    bgClass: 'bg-amber-300/80',
    borderClass: 'border-amber-200',
    glowClass: 'shadow-[0_0_20px_rgba(252,211,77,0.6)]',
    textClass: 'text-amber-300',
  },
];

export const BALLOON_COLOR_MAP: Record<string, BalloonColorOption> = {
  '#F472B6': BALLOON_PALETTE[0],
  '#A78BFA': BALLOON_PALETTE[1],
  '#38BDF8': BALLOON_PALETTE[2],
  '#34D399': BALLOON_PALETTE[3],
  '#FCD34D': BALLOON_PALETTE[4],
  pink: BALLOON_PALETTE[0],
  lavender: BALLOON_PALETTE[1],
  sky: BALLOON_PALETTE[2],
  mint: BALLOON_PALETTE[3],
  yellow: BALLOON_PALETTE[4],
};

export const getBalloonColorConfig = (color: string): BalloonColorOption => {
  return BALLOON_COLOR_MAP[color] || {
    key: 'pink',
    name: '사용자 풍선',
    hex: color || '#F472B6',
    bgClass: 'bg-pink-400/80',
    borderClass: 'border-pink-300',
    glowClass: 'shadow-[0_0_20px_rgba(244,114,182,0.6)]',
    textClass: 'text-pink-300',
  };
};

// 최근 12시간 이내의 시간을 생성하는 헬퍼 (초기 Mock 데이터용)
const getRecentIso = (hoursAgo: number) => {
  return new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
};

export const INITIAL_WISHES: Wish[] = [
  // 대한민국 (KR)
  {
    id: 'wish-kr-1',
    content: '우리가 준비해 온 모든 노력이 따뜻한 결실로 피어나기를.',
    balloon_color: '#F472B6',
    country_code: 'KR',
    country_name: '대한민국',
    cheer_count: 42,
    created_at: getRecentIso(2),
  },
  {
    id: 'wish-kr-2',
    content: '가족 모두 건강하고, 마음에 잔잔한 여유가 늘 머물기를 빌어요 🌙',
    balloon_color: '#A78BFA',
    country_code: 'KR',
    country_name: '대한민국',
    cheer_count: 28,
    created_at: getRecentIso(4),
  },
  {
    id: 'wish-kr-3',
    content: '어두운 터널 끝에서 마침내 찬란한 새벽빛을 마주할 수 있기를.',
    balloon_color: '#38BDF8',
    country_code: 'KR',
    country_name: '대한민국',
    cheer_count: 57,
    created_at: getRecentIso(6),
  },
  {
    id: 'wish-kr-4',
    content: '사랑하는 사람과 함께 별을 올려다볼 수 있는 작은 행복이 영원하길.',
    balloon_color: '#34D399',
    country_code: 'KR',
    country_name: '대한민국',
    cheer_count: 33,
    created_at: getRecentIso(8),
  },
  {
    id: 'wish-kr-5',
    content: '오늘 하루도 수고 많았어. 내일의 너는 더욱 빛날 거야 ✨',
    balloon_color: '#FCD34D',
    country_code: 'KR',
    country_name: '대한민국',
    cheer_count: 65,
    created_at: getRecentIso(1),
  },

  // 일본 (JP)
  {
    id: 'wish-jp-1',
    content: '春の桜のように、また美しく笑い合える日が来ますように。🌸',
    balloon_color: '#F472B6',
    country_code: 'JP',
    country_name: '일본',
    cheer_count: 39,
    created_at: getRecentIso(3),
  },
  {
    id: 'wish-jp-2',
    content: '大切な人の夢が叶いますように、遠くの空から祈っています。',
    balloon_color: '#38BDF8',
    country_code: 'JP',
    country_name: '일본',
    cheer_count: 47,
    created_at: getRecentIso(5),
  },
  {
    id: 'wish-jp-3',
    content: '静かな夜の海のように、穏やかで優しい明日になりますように。',
    balloon_color: '#A78BFA',
    country_code: 'JP',
    country_name: '일본',
    cheer_count: 22,
    created_at: getRecentIso(7),
  },
  {
    id: 'wish-jp-4',
    content: '새로운 도전을 시작하는 모든 사람들에게 따뜻한 용기가 전해지길 🎐',
    balloon_color: '#34D399',
    country_code: 'JP',
    country_name: '일본',
    cheer_count: 31,
    created_at: getRecentIso(2.5),
  },

  // 미국 (US)
  {
    id: 'wish-us-1',
    content: 'May peace and kindness find their way to every corner of the world 🕊️',
    balloon_color: '#38BDF8',
    country_code: 'US',
    country_name: '미국',
    cheer_count: 76,
    created_at: getRecentIso(1.5),
  },
  {
    id: 'wish-us-2',
    content: 'Wishing for courage to chase the dreams I was once too afraid to speak of.',
    balloon_color: '#FCD34D',
    country_code: 'US',
    country_name: '미국',
    cheer_count: 53,
    created_at: getRecentIso(4.5),
  },
  {
    id: 'wish-us-3',
    content: 'For my grandmother to heal and smile brightly under the sun again.',
    balloon_color: '#F472B6',
    country_code: 'US',
    country_name: '미국',
    cheer_count: 88,
    created_at: getRecentIso(9),
  },
  {
    id: 'wish-us-4',
    content: 'Sending warm love to everyone feeling lonely tonight. You are never alone.',
    balloon_color: '#A78BFA',
    country_code: 'US',
    country_name: '미국',
    cheer_count: 64,
    created_at: getRecentIso(11),
  },
];

export const KNOWN_COUNTRIES: Record<string, CountryInfo> = {
  KR: { code: 'KR', name: '대한민국', flag: '🇰🇷', englishName: 'South Korea' },
  JP: { code: 'JP', name: '일본', flag: '🇯🇵', englishName: 'Japan' },
  US: { code: 'US', name: '미국', flag: '🇺🇸', englishName: 'United States of America' },
  CN: { code: 'CN', name: '중국', flag: '🇨🇳', englishName: 'China' },
  GB: { code: 'GB', name: '영국', flag: '🇬🇧', englishName: 'United Kingdom' },
  FR: { code: 'FR', name: '프랑스', flag: '🇫🇷', englishName: 'France' },
  DE: { code: 'DE', name: '독일', flag: '🇩🇪', englishName: 'Germany' },
  CA: { code: 'CA', name: '캐나다', flag: '🇨🇦', englishName: 'Canada' },
  AU: { code: 'AU', name: '호주', flag: '🇦🇺', englishName: 'Australia' },
  IT: { code: 'IT', name: '이탈리아', flag: '🇮🇹', englishName: 'Italy' },
  ES: { code: 'ES', name: '스페인', flag: '🇪🇸', englishName: 'Spain' },
  BR: { code: 'BR', name: '브라질', flag: '🇧🇷', englishName: 'Brazil' },
  IN: { code: 'IN', name: '인도', flag: '🇮🇳', englishName: 'India' },
  VN: { code: 'VN', name: '베트남', flag: '🇻🇳', englishName: 'Vietnam' },
  TH: { code: 'TH', name: '태국', flag: '🇹🇭', englishName: 'Thailand' },
  SG: { code: 'SG', name: '싱가포르', flag: '🇸🇬', englishName: 'Singapore' },
  TW: { code: 'TW', name: '대만', flag: '🇹🇼', englishName: 'Taiwan' },
};

export function resolveCountry(geoName: string, geoId: string): CountryInfo {
  if (geoName.includes('Korea') || geoId === '410') {
    return KNOWN_COUNTRIES.KR;
  }
  if (geoName === 'Japan' || geoId === '392') {
    return KNOWN_COUNTRIES.JP;
  }
  if (geoName.includes('United States') || geoId === '840') {
    return KNOWN_COUNTRIES.US;
  }

  for (const item of Object.values(KNOWN_COUNTRIES)) {
    if (item.englishName.toLowerCase() === geoName.toLowerCase()) {
      return item;
    }
  }

  const code = geoName.slice(0, 2).toUpperCase() || 'UN';
  return {
    code,
    name: geoName || '미지의 나라',
    flag: '🌍',
    englishName: geoName,
  };
}
