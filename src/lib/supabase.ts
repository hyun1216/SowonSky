import { createClient } from '@supabase/supabase-js';
import { Wish, CreateWishInput } from '../types/wish';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Environment variables are missing or incomplete.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 12시간 이전 ISO 타임스탬프 반환 헬퍼
 */
export function getTwelveHoursAgoIso(): string {
  const date = new Date(Date.now() - 12 * 60 * 60 * 1000);
  return date.toISOString();
}

/**
 * 특정 국가의 12시간 이내 활성 소원 목록 조회 (내림차순)
 */
export async function getActiveWishesByCountry(countryCode: string): Promise<Wish[]> {
  const twelveHoursAgo = getTwelveHoursAgoIso();

  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .eq('country_code', countryCode)
    .gte('created_at', twelveHoursAgo)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`[getActiveWishesByCountry] Error fetching wishes for ${countryCode}:`, error);
    throw error;
  }

  return (data || []) as Wish[];
}

/**
 * 소원 작성 (Insert)
 */
export async function createWish(input: CreateWishInput): Promise<Wish> {
  const { data, error } = await supabase
    .from('wishes')
    .insert([
      {
        content: input.content.slice(0, 100),
        balloon_color: input.balloon_color || '#F472B6',
        country_code: input.country_code.toUpperCase(),
        country_name: input.country_name,
        cheer_count: 0,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('[createWish] Error inserting wish:', error);
    throw error;
  }

  return data as Wish;
}

/**
 * 소원 응원하기 (RPC increment_cheer 호출 + Fallback)
 */
export async function cheerWish(wishId: string): Promise<number | null> {
  // 1. RPC 함수 호출 시도
  const { data: rpcData, error: rpcError } = await supabase.rpc('increment_cheer', {
    wish_id: wishId,
  });

  if (!rpcError && typeof rpcData === 'number') {
    return rpcData;
  }

  // 2. RPC 함수가 없거나 실패 시 fallback update
  if (rpcError) {
    console.warn('[cheerWish] RPC increment_cheer failed, falling back to manual update:', rpcError.message);
  }

  const { data: currentWish, error: fetchError } = await supabase
    .from('wishes')
    .select('cheer_count')
    .eq('id', wishId)
    .single();

  if (fetchError || !currentWish) {
    console.error('[cheerWish] Failed to fetch current cheer_count for fallback:', fetchError);
    return null;
  }

  const nextCount = (currentWish.cheer_count ?? 0) + 1;
  const { error: updateError } = await supabase
    .from('wishes')
    .update({ cheer_count: nextCount })
    .eq('id', wishId);

  if (updateError) {
    console.error('[cheerWish] Fallback update failed:', updateError);
    return null;
  }

  return nextCount;
}

/**
 * 12시간 이내의 활성 소원 개수를 국가별로 집계 (세계 지도용)
 */
export async function getWishCountByCountries(): Promise<Record<string, number>> {
  const twelveHoursAgo = getTwelveHoursAgoIso();

  const { data, error } = await supabase
    .from('wishes')
    .select('country_code')
    .gte('created_at', twelveHoursAgo);

  if (error) {
    console.error('[getWishCountByCountries] Error fetching counts:', error);
    return {};
  }

  const counts: Record<string, number> = {};
  (data || []).forEach((row: { country_code: string }) => {
    const code = row.country_code?.toUpperCase();
    if (code) {
      counts[code] = (counts[code] || 0) + 1;
    }
  });

  return counts;
}
