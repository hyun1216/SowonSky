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
    id: 'wish-kr-user-1',
    content: '여자친구 생기게 해주세요 제발;',
    balloon_color: '#F472B6',
    country_code: 'KR',
    country_name: '대한민국',
    cheer_count: 77,
    created_at: getRecentIso(0.5),
  },
  {
    id: 'wish-kr-user-2',
    content: '하이닉스 400만원',
    balloon_color: '#38BDF8',
    country_code: 'KR',
    country_name: '대한민국',
    cheer_count: 128,
    created_at: getRecentIso(1),
  },
  {
    id: 'wish-kr-user-3',
    content: '남자친구랑 결혼하게 해주세요 (남친없음)',
    balloon_color: '#A78BFA',
    country_code: 'KR',
    country_name: '대한민국',
    cheer_count: 93,
    created_at: getRecentIso(1.5),
  },
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
    content: '推しのライブ最前列当たりますように…！🙏',
    balloon_color: '#F472B6',
    country_code: 'JP',
    country_name: '일본',
    cheer_count: 84,
    created_at: getRecentIso(1),
  },
  {
    id: 'wish-jp-2',
    content: 'ボーナス上がって美味しいお寿司食べたい🍣',
    balloon_color: '#FCD34D',
    country_code: 'JP',
    country_name: '일본',
    cheer_count: 112,
    created_at: getRecentIso(2),
  },
  {
    id: 'wish-jp-3',
    content: '好きな人と付き合えますように、どうか届いて…',
    balloon_color: '#A78BFA',
    country_code: 'JP',
    country_name: '일본',
    cheer_count: 95,
    created_at: getRecentIso(3.5),
  },
  {
    id: 'wish-jp-4',
    content: '転職がうまくいって、もっと自由な時間ができますように ✨',
    balloon_color: '#34D399',
    country_code: 'JP',
    country_name: '일본',
    cheer_count: 67,
    created_at: getRecentIso(5),
  },
  {
    id: 'wish-jp-5',
    content: '明日もみんなが笑顔で過ごせますように 🌙',
    balloon_color: '#38BDF8',
    country_code: 'JP',
    country_name: '일본',
    cheer_count: 140,
    created_at: getRecentIso(6.5),
  },

  // 미국 (US)
  {
    id: 'wish-us-1',
    content: 'Please let my student loans miraculously disappear 😭',
    balloon_color: '#38BDF8',
    country_code: 'US',
    country_name: '미국',
    cheer_count: 245,
    created_at: getRecentIso(1.5),
  },
  {
    id: 'wish-us-2',
    content: 'To finally land that remote dream job and travel the world ✈️',
    balloon_color: '#34D399',
    country_code: 'US',
    country_name: '미국',
    cheer_count: 189,
    created_at: getRecentIso(2),
  },
  {
    id: 'wish-us-3',
    content: 'Hoping she texts me back first tomorrow morning...',
    balloon_color: '#F472B6',
    country_code: 'US',
    country_name: '미국',
    cheer_count: 73,
    created_at: getRecentIso(3),
  },
  {
    id: 'wish-us-4',
    content: 'May everyone battling silent battles tonight find peace and hope 🕊️',
    balloon_color: '#A78BFA',
    country_code: 'US',
    country_name: '미국',
    cheer_count: 310,
    created_at: getRecentIso(4.5),
  },
  {
    id: 'wish-us-5',
    content: 'Just want a cozy little home with two cats and zero stress 🐱',
    balloon_color: '#FCD34D',
    country_code: 'US',
    country_name: '미국',
    cheer_count: 164,
    created_at: getRecentIso(6),
  },

  // 프랑스 (FR)
  {
    id: 'wish-fr-1',
    content: 'Que l\'amour vienne enfin frapper à ma porte sous la pluie de Paris ☕',
    balloon_color: '#F472B6',
    country_code: 'FR',
    country_name: '프랑스',
    cheer_count: 58,
    created_at: getRecentIso(2.5),
  },
  {
    id: 'wish-fr-2',
    content: 'Réussir mes examens et boire un bon vin au bord de la Seine 🍷',
    balloon_color: '#A78BFA',
    country_code: 'FR',
    country_name: '프랑스',
    cheer_count: 82,
    created_at: getRecentIso(4),
  },
  {
    id: 'wish-fr-3',
    content: 'Trouver enfin la paix intérieure et du temps pour voyager ✨',
    balloon_color: '#38BDF8',
    country_code: 'FR',
    country_name: '프랑스',
    cheer_count: 71,
    created_at: getRecentIso(5.5),
  },

  // 대만 (TW)
  {
    id: 'wish-tw-1',
    content: '希望全家人身體健康，平安順遂 🏮',
    balloon_color: '#FCD34D',
    country_code: 'TW',
    country_name: '대만',
    cheer_count: 94,
    created_at: getRecentIso(1),
  },
  {
    id: 'wish-tw-2',
    content: '今年一定要發大財，股票一路長紅！📈',
    balloon_color: '#34D399',
    country_code: 'TW',
    country_name: '대만',
    cheer_count: 135,
    created_at: getRecentIso(2.5),
  },
  {
    id: 'wish-tw-3',
    content: '願世界溫柔待我，所有的遺憾都是驚喜的鋪墊 ✨',
    balloon_color: '#F472B6',
    country_code: 'TW',
    country_name: '대만',
    cheer_count: 88,
    created_at: getRecentIso(4),
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
