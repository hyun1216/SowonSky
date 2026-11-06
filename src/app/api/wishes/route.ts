import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { checkProfanity } from '@/lib/profanityFilter';
import { KNOWN_COUNTRIES } from '@/data/mockWishes';

const IP_SALT = process.env.IP_HASH_SALT || 'sowonsky_secret_salt_2026';

/**
 * 클라이언트 IP 추출 헬퍼
 */
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * IP를 SHA-256으로 단방향 해싱
 */
function hashIp(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + IP_SALT)
    .digest('hex');
}

/**
 * 한국 시간(KST, UTC+9) 기준 오늘 자정의 UTC ISO 문자열 반환
 */
function getKstMidnightUtcIso(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  kstDate.setUTCHours(0, 0, 0, 0);
  return new Date(kstDate.getTime() - kstOffset).toISOString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, balloon_color } = body;

    // 1. 내용 기본 유효성 검사
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'INVALID_CONTENT', message: '소원 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (content.trim().length > 100) {
      return NextResponse.json(
        { error: 'CONTENT_TOO_LONG', message: '소원은 100자 이내로 작성해주세요.' },
        { status: 400 }
      );
    }

    // 2. 유해 단어 및 비속어/위험 키워드 필터링
    const filterResult = checkProfanity(content);
    if (!filterResult.isValid) {
      return NextResponse.json(
        {
          error: filterResult.reason || 'PROFANITY_DETECTED',
          message: filterResult.message || '부적절한 단어가 포함되어 있습니다.',
        },
        { status: 400 }
      );
    }

    // 3. 서버 기반 접속 국가 자동 감지
    // Vercel 헤더 'x-vercel-ip-country' 확인
    const detectedCountryCode =
      req.headers.get('x-vercel-ip-country')?.toUpperCase() ||
      body.country_code?.toUpperCase() ||
      'KR';

    const matchedCountry = KNOWN_COUNTRIES[detectedCountryCode];
    const countryName = matchedCountry
      ? matchedCountry.name
      : body.country_name || detectedCountryCode;

    // 4. IP 해싱 및 하루 2회 제한 검사 (KST 자정 기준)
    const clientIp = getClientIp(req);
    const ipHash = hashIp(clientIp);
    const kstMidnight = getKstMidnightUtcIso();

    // 오늘 해당 ip_hash로 등록된 소원 개수 조회
    const { count, error: countError } = await supabase
      .from('wishes')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', kstMidnight);

    if (countError) {
      console.warn('[POST /api/wishes] IP count check warning (column may not exist yet):', countError.message);
    } else if (typeof count === 'number' && count >= 2) {
      return NextResponse.json(
        {
          error: 'DAILY_LIMIT_EXCEEDED',
          message: '오늘 띄울 수 있는 소원(하루 최대 2회)을 모두 사용하셨습니다. 내일 다시 찾아와주세요 🌙',
          limit: 2,
          count,
        },
        { status: 429 }
      );
    }

    // 5. Supabase wishes 테이블에 소원 INSERT
    const insertPayload: Record<string, any> = {
      content: content.trim(),
      balloon_color: balloon_color || '#F472B6',
      country_code: detectedCountryCode,
      country_name: countryName,
      cheer_count: 0,
      ip_hash: ipHash,
    };

    let { data: newWish, error: insertError } = await supabase
      .from('wishes')
      .insert([insertPayload])
      .select()
      .single();

    // ip_hash 컬럼이 아직 테이블에 없을 경우를 대비한 안전 폴백
    if (insertError && insertError.message.includes('ip_hash')) {
      console.warn('[POST /api/wishes] Retrying without ip_hash column...');
      delete insertPayload.ip_hash;
      const retryResult = await supabase
        .from('wishes')
        .insert([insertPayload])
        .select()
        .single();
      newWish = retryResult.data;
      insertError = retryResult.error;
    }

    if (insertError || !newWish) {
      console.error('[POST /api/wishes] Insert failed:', insertError);
      return NextResponse.json(
        { error: 'DATABASE_ERROR', message: '소원을 띄우는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        wish: newWish,
        detectedCountry: {
          code: detectedCountryCode,
          name: countryName,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[POST /api/wishes] Unexpected error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

