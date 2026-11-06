/**
 * 로컬스토리지 기반 하루 2회 소원 등록 제한 헬퍼 (KST 자정 기준)
 */

export const MAX_DAILY_WISHES = 2;

function getKstDateKey(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  return kstDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export function getTodayWishCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const todayKey = getKstDateKey();
    const stored = localStorage.getItem(`sowonsky_wish_count_${todayKey}`);
    return stored ? parseInt(stored, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function incrementTodayWishCount(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const todayKey = getKstDateKey();
    const current = getTodayWishCount();
    const next = current + 1;
    localStorage.setItem(`sowonsky_wish_count_${todayKey}`, String(next));
    return next;
  } catch {
    return 1;
  }
}

export function canCreateWishToday(): boolean {
  return getTodayWishCount() < MAX_DAILY_WISHES;
}

