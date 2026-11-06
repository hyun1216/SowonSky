'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Wish, WishWithTimer } from '../types/wish';
import {
  supabase,
  getActiveWishesByCountry,
  cheerWish as apiCheerWish,
} from '../lib/supabase';
import { INITIAL_WISHES } from '../data/mockWishes';
import { incrementTodayWishCount } from '../lib/wishLimit';

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

function formatSecondsToHms(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
}

function attachTimerInfo(wish: Wish, nowMs: number): WishWithTimer {
  const createdMs = new Date(wish.created_at).getTime();
  const elapsedMs = nowMs - createdMs;
  const remainingMs = Math.max(0, TWELVE_HOURS_MS - elapsedMs);
  const remainingSeconds = Math.floor(remainingMs / 1000);

  return {
    ...wish,
    remainingSeconds,
    remainingTimeFormatted: formatSecondsToHms(remainingSeconds),
    isExpired: remainingMs <= 0,
  };
}

export function useRealtimeWishes(countryCode: string, countryName: string) {
  const [wishes, setWishes] = useState<WishWithTimer[]>([]);
  const [poppingWishIds, setPoppingWishIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const countryCodeRef = useRef(countryCode);
  const cheerLockRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    countryCodeRef.current = countryCode;
  }, [countryCode]);

  // 1. 초기 데이터 로드 (12시간 이내)
  const fetchWishes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getActiveWishesByCountry(countryCode);
      const now = Date.now();

      if (data && data.length > 0) {
        const enriched = data.map((w) => attachTimerInfo(w, now)).filter((w) => !w.isExpired);
        setWishes(enriched);
      } else {
        const mockFallback = INITIAL_WISHES
          .filter((w) => w.country_code === countryCode)
          .map((w) => attachTimerInfo(w, now))
          .filter((w) => !w.isExpired);
        setWishes(mockFallback);
      }
    } catch (err: any) {
      console.warn('[useRealtimeWishes] Falling back to mock data:', err?.message || err);
      const now = Date.now();
      const mockFallback = INITIAL_WISHES
        .filter((w) => w.country_code === countryCode)
        .map((w) => attachTimerInfo(w, now))
        .filter((w) => !w.isExpired);
      setWishes(mockFallback);
      setError(err?.message || '소원을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [countryCode]);

  useEffect(() => {
    fetchWishes();
  }, [fetchWishes]);

  // 2. 1초마다 남은 시간 계산 및 12시간 만료 시 폭발(별가루) 처리
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      setWishes((prevWishes) => {
        let hasStateChanged = false;
        const newlyExpiredIds: string[] = [];

        const updated = prevWishes.map((w) => {
          const next = attachTimerInfo(w, now);
          if (next.remainingSeconds !== w.remainingSeconds || next.isExpired !== w.isExpired) {
            hasStateChanged = true;
          }
          if (next.isExpired && !w.isExpired) {
            newlyExpiredIds.push(w.id);
          }
          return next;
        });

        if (newlyExpiredIds.length > 0) {
          setPoppingWishIds((prev) => {
            const nextSet = new Set(prev);
            newlyExpiredIds.forEach((id) => nextSet.add(id));
            return nextSet;
          });

          setTimeout(() => {
            setWishes((curr) => curr.filter((item) => !newlyExpiredIds.includes(item.id)));
            setPoppingWishIds((prev) => {
              const nextSet = new Set(prev);
              newlyExpiredIds.forEach((id) => nextSet.delete(id));
              return nextSet;
            });
          }, 1500);
        }

        return hasStateChanged ? updated : prevWishes;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 3. Supabase Realtime 채널 구독
  useEffect(() => {
    const channelName = `realtime-wishes-${countryCode}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wishes',
        },
        (payload) => {
          const now = Date.now();

          if (payload.eventType === 'INSERT') {
            const newWish = payload.new as Wish;
            if (newWish.country_code?.toUpperCase() === countryCodeRef.current.toUpperCase()) {
              const withTimer = attachTimerInfo(newWish, now);
              if (!withTimer.isExpired) {
                setWishes((prev) => {
                  const exists = prev.some((w) => w.id === newWish.id);
                  if (exists) return prev;
                  return [withTimer, ...prev];
                });
              }
            }
          }

          if (payload.eventType === 'UPDATE') {
            const updatedWish = payload.new as Wish;
            setWishes((prev) =>
              prev.map((w) => {
                if (w.id === updatedWish.id) {
                  return {
                    ...w,
                    cheer_count: updatedWish.cheer_count,
                    content: updatedWish.content,
                    balloon_color: updatedWish.balloon_color,
                  };
                }
                return w;
              })
            );
          }

          if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id;
            if (deletedId) {
              setWishes((prev) => prev.filter((w) => w.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [countryCode]);

  // 4. API Route (/api/wishes)를 통한 안전한 소원 등록
  const addWish = async (
    content: string,
    balloonColor: string
  ): Promise<{ success: boolean; error?: string; isLimitReached?: boolean }> => {
    const tempId = `temp-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const optimisticWish: WishWithTimer = {
      id: tempId,
      content,
      balloon_color: balloonColor,
      country_code: countryCode,
      country_name: countryName,
      cheer_count: 0,
      created_at: nowIso,
      remainingSeconds: 12 * 3600,
      remainingTimeFormatted: '12:00:00',
      isExpired: false,
    };

    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          balloon_color: balloonColor,
          country_code: countryCode,
          country_name: countryName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || '소원을 띄우는 데 실패했습니다.',
          isLimitReached: response.status === 429,
        };
      }

      // 등록 성공 시 로컬스토리지 카운트 증가
      incrementTodayWishCount();

      // UI에 새 풍선 즉시 띄우기
      const createdWish = data.wish as Wish;
      const enriched = attachTimerInfo(createdWish, Date.now());

      setWishes((prev) => {
        const withoutTemp = prev.filter((w) => w.id !== tempId && w.id !== enriched.id);
        return [enriched, ...withoutTemp];
      });

      return { success: true };
    } catch (err: any) {
      console.warn('[useRealtimeWishes] addWish error:', err);
      return {
        success: false,
        error: '네트워크 연결 상태를 확인해주세요.',
      };
    }
  };

  // 5. 응원하기 액션 (중복 연타 및 다중 호출 방지 락 적용)
  const cheerWishAction = async (wishId: string): Promise<number> => {
    if (cheerLockRef.current.has(wishId)) {
      return 0;
    }
    cheerLockRef.current.add(wishId);
    setTimeout(() => {
      cheerLockRef.current.delete(wishId);
    }, 600);

    let nextCount = 1;

    setWishes((prev) =>
      prev.map((w) => {
        if (w.id === wishId) {
          nextCount = (w.cheer_count ?? 0) + 1;
          return { ...w, cheer_count: nextCount };
        }
        return w;
      })
    );

    try {
      const updatedCount = await apiCheerWish(wishId);
      if (updatedCount !== null) {
        setWishes((prev) =>
          prev.map((w) => (w.id === wishId ? { ...w, cheer_count: updatedCount } : w))
        );
        return updatedCount;
      }
    } catch (err) {
      console.warn('[useRealtimeWishes] cheerWish error:', err);
    }

    return nextCount;
  };

  return {
    wishes,
    poppingWishIds,
    isLoading,
    error,
    addWish,
    cheerWish: cheerWishAction,
    refetch: fetchWishes,
  };
}
