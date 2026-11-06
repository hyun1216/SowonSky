import { Wish, BalloonColor, CountryInfo } from '../types/wish';

export const BALLOON_COLOR_MAP: Record<BalloonColor, { name: string; hex: string; bgClass: string; borderClass: string; glowClass: string; textClass: string }> = {
  pink: {
    name: '소프트 핑크',
    hex: '#F472B6',
    bgClass: 'bg-pink-400/80',
    borderClass: 'border-pink-300',
    glowClass: 'shadow-[0_0_20px_rgba(244,114,182,0.6)]',
    textClass: 'text-pink-300',
  },
  lavender: {
    name: '라벤더',
    hex: '#A78BFA',
    bgClass: 'bg-purple-400/80',
    borderClass: 'border-purple-300',
    glowClass: 'shadow-[0_0_20px_rgba(167,139,250,0.6)]',
    textClass: 'text-purple-300',
  },
  sky: {
    name: '스카이블루',
    hex: '#38BDF8',
    bgClass: 'bg-sky-400/80',
    borderClass: 'border-sky-300',
    glowClass: 'shadow-[0_0_20px_rgba(56,189,248,0.6)]',
    textClass: 'text-sky-300',
  },
  mint: {
    name: '민트',
    hex: '#34D399',
    bgClass: 'bg-emerald-400/80',
    borderClass: 'border-emerald-300',
    glowClass: 'shadow-[0_0_20px_rgba(52,211,153,0.6)]',
    textClass: 'text-emerald-300',
  },
  yellow: {
    name: '파스텔 옐로우',
    hex: '#FCD34D',
    bgClass: 'bg-amber-300/80',
    borderClass: 'border-amber-200',
    glowClass: 'shadow-[0_0_20px_rgba(252,211,77,0.6)]',
    textClass: 'text-amber-300',
  },
};

export const INITIAL_WISHES: Wish[] = [
  // 대한민국 (KR)
  {
    id: 'wish-kr-1',
    content: '우리가 준비해 온 모든 노력이 따뜻한 결실로 피어나기를.',
    balloonColor: 'pink',
    countryCode: 'KR',
    countryName: '대한민국',
    cheerCount: 42,
    createdAt: '2026-11-05 21:30',
  },
  {
    id: 'wish-kr-2',
    content: '가족 모두 건강하고, 마음에 잔잔한 여유가 늘 머물기를 빌어요 🌙',
    balloonColor: 'lavender',
    countryCode: 'KR',
    countryName: '대한민국',
    cheerCount: 28,
    createdAt: '2026-11-05 22:15',
  },
  {
    id: 'wish-kr-3',
    content: '어두운 터널 끝에서 마침내 찬란한 새벽빛을 마주할 수 있기를.',
    balloonColor: 'sky',
    countryCode: 'KR',
    countryName: '대한민국',
    cheerCount: 57,
    createdAt: '2026-11-06 01:05',
  },
  {
    id: 'wish-kr-4',
    content: '사랑하는 사람과 함께 별을 올려다볼 수 있는 작은 행복이 영원하길.',
    balloonColor: 'mint',
    countryCode: 'KR',
    countryName: '대한민국',
    cheerCount: 33,
    createdAt: '2026-11-06 09:40',
  },
  {
    id: 'wish-kr-5',
    content: '오늘 하루도 수고 많았어. 내일의 너는 더욱 빛날 거야 ✨',
    balloonColor: 'yellow',
    countryCode: 'KR',
    countryName: '대한민국',
    cheerCount: 65,
    createdAt: '2026-11-06 14:10',
  },

  // 일본 (JP)
  {
    id: 'wish-jp-1',
    content: '春の桜のように、また美しく笑い合える日が来ますように。🌸 (봄의 벚꽃처럼 다시 아름답게 웃을 수 있는 날이 오기를)',
    balloonColor: 'pink',
    countryCode: 'JP',
    countryName: '일본',
    cheerCount: 39,
    createdAt: '2026-11-05 18:20',
  },
  {
    id: 'wish-jp-2',
    content: '大切な人の夢が叶いますように、遠くの空から祈っています。 (소중한 사람의 꿈이 이루어지길 먼 하늘에서 기도해요)',
    balloonColor: 'sky',
    countryCode: 'JP',
    countryName: '일본',
    cheerCount: 47,
    createdAt: '2026-11-05 23:50',
  },
  {
    id: 'wish-jp-3',
    content: '静かな夜の海のように、穏やかで優しい明日になりますように。 (고요한 밤바다처럼 평온하고 다정한 내일이 되기를)',
    balloonColor: 'lavender',
    countryCode: 'JP',
    countryName: '일본',
    cheerCount: 22,
    createdAt: '2026-11-06 08:30',
  },
  {
    id: 'wish-jp-4',
    content: '새로운 도전을 시작하는 모든 사람들에게 따뜻한 용기가 전해지길 🎐',
    balloonColor: 'mint',
    countryCode: 'JP',
    countryName: '일본',
    cheerCount: 31,
    createdAt: '2026-11-06 11:20',
  },

  // 미국 (US)
  {
    id: 'wish-us-1',
    content: 'May peace and kindness find their way to every corner of the world 🕊️',
    balloonColor: 'sky',
    countryCode: 'US',
    countryName: '미국',
    cheerCount: 76,
    createdAt: '2026-11-05 15:40',
  },
  {
    id: 'wish-us-2',
    content: 'Wishing for courage to chase the dreams I was once too afraid to speak of.',
    balloonColor: 'yellow',
    countryCode: 'US',
    countryName: '미국',
    cheerCount: 53,
    createdAt: '2026-11-05 20:10',
  },
  {
    id: 'wish-us-3',
    content: 'For my grandmother to heal and smile brightly under the sun again.',
    balloonColor: 'pink',
    countryCode: 'US',
    countryName: '미국',
    cheerCount: 88,
    createdAt: '2026-11-06 02:25',
  },
  {
    id: 'wish-us-4',
    content: 'Sending warm love to everyone feeling lonely tonight. You are never alone.',
    balloonColor: 'lavender',
    countryCode: 'US',
    countryName: '미국',
    cheerCount: 64,
    createdAt: '2026-11-06 06:15',
  },
];

// ISO / 이름 매핑 테이블
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

// world-atlas TopoJSON geography name/id 매핑 헬퍼
export function resolveCountry(geoName: string, geoId: string): CountryInfo {
  // 1. 한국
  if (geoName.includes('Korea') || geoId === '410') {
    return KNOWN_COUNTRIES.KR;
  }
  // 2. 일본
  if (geoName === 'Japan' || geoId === '392') {
    return KNOWN_COUNTRIES.JP;
  }
  // 3. 미국
  if (geoName.includes('United States') || geoId === '840') {
    return KNOWN_COUNTRIES.US;
  }

  // 매핑 리스트에서 찾기
  for (const item of Object.values(KNOWN_COUNTRIES)) {
    if (item.englishName.toLowerCase() === geoName.toLowerCase()) {
      return item;
    }
  }

  // 기타 국가
  const code = geoName.slice(0, 2).toUpperCase() || 'UN';
  return {
    code,
    name: geoName || '미지의 나라',
    flag: '🌍',
    englishName: geoName,
  };
}

