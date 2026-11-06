/**
 * 소원하늘 유해 단어 및 욕설/위험 키워드 필터링 모듈
 */

// 자살, 살인 등 심각한 위험/자해 키워드 (정규식)
const DANGER_PATTERNS = [
  /자살/i,
  /살인/i,
  /죽어/i,
  /죽이고/i,
  /죽자/i,
  /목매/i,
  /극단적\s*선택/i,
  /suicide/i,
  /kill\s*(you|myself|him|her|them)/i,
  /murder/i,
  /hang\s*myself/i,
];

// 한국어 및 영어 대표 비속어/욕설 목록 및 패턴
const PROFANITY_PATTERNS = [
  /시[바발빨벌]/i,
  /씨[바발빨벌]/i,
  /ㅅ[ㅂㅂ]/i,
  /개[새세]끼/i,
  /새[끼키]/i,
  /병[신씬]/i,
  /ㅄ/i,
  /지[랄럴]/i,
  /존[나낟]/i,
  /좆/i,
  /창[녀남]/i,
  /걸[레]/i,
  /보[지]/i,
  /자[지]/i,
  /니[애에]미/i,
  /느[금김]마/i,
  /염[병]/i,
  /닥[쳐]/i,
  /꺼[져]/i,
  /fuck/i,
  /shit/i,
  /bitch/i,
  /bastard/i,
  /asshole/i,
  /dick/i,
  /pussy/i,
  /cunt/i,
];

export interface FilterResult {
  isValid: boolean;
  reason?: 'DANGER_KEYWORD' | 'PROFANITY';
  message?: string;
}

/**
 * 텍스트 내 유해 단어 및 위험 키워드 검사
 */
export function checkProfanity(text: string): FilterResult {
  if (!text || typeof text !== 'string') {
    return { isValid: false, message: '소원 내용을 입력해주세요.' };
  }

  // 1. 공백 및 특수문자 정규화 (변형 욕설 감지 보조)
  const normalized = text.replace(/[\s\-_.,!@#$%^&*()]/g, '');

  // 2. 위험/자해/살해 키워드 검사 (최우선 차단)
  for (const pattern of DANGER_PATTERNS) {
    if (pattern.test(text) || pattern.test(normalized)) {
      return {
        isValid: false,
        reason: 'DANGER_KEYWORD',
        message: '마음이 힘드실 때 도움을 받을 수 있는 상담 전화(109)가 있습니다. 당신은 소중한 사람입니다.',
      };
    }
  }

  // 3. 비속어/욕설 검사
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(text) || pattern.test(normalized)) {
      return {
        isValid: false,
        reason: 'PROFANITY',
        message: '밤하늘을 흐리는 비속어나 거친 표현이 포함되어 있습니다. 따뜻하고 고운 소망을 담아주세요.',
      };
    }
  }

  return { isValid: true };
}

