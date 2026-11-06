'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Plus } from 'lucide-react';
import { Wish, CountryInfo } from '../types/wish';
import Balloon from './Balloon';
import { KNOWN_COUNTRIES } from '../data/mockWishes';

interface SkyViewProps {
  selectedCountry: { code: string; name: string };
  wishes: Wish[];
  onBackToMap: () => void;
  onOpenWriteModal: () => void;
  onSelectWish: (wish: Wish) => void;
}

export default function SkyView({
  selectedCountry,
  wishes,
  onBackToMap,
  onOpenWriteModal,
  onSelectWish,
}: SkyViewProps) {
  // 현재 국가의 소원 목록
  const countryWishes = useMemo(() => {
    return wishes.filter((w) => w.countryCode === selectedCountry.code);
  }, [wishes, selectedCountry.code]);

  // 국가 메타데이터 (국기 이모지 등)
  const countryInfo: CountryInfo =
    KNOWN_COUNTRIES[selectedCountry.code] || {
      code: selectedCountry.code,
      name: selectedCountry.name,
      flag: '🌍',
      englishName: selectedCountry.name,
    };

  // 풍선 위치 및 애니메이션 타이밍 결정 (중복 겹침 최소화)
  const balloonConfigs = useMemo(() => {
    return countryWishes.map((wish, index) => {
      // 12% ~ 86% 사이에 균일 분산 + 의사 난수 지터
      const slotWidth = 74 / Math.max(countryWishes.length, 1);
      const baseX = 12 + index * slotWidth;
      const jitter = ((wish.id.charCodeAt(wish.id.length - 1) * 7) % 8) - 4;
      const xPercent = Math.min(88, Math.max(8, baseX + jitter));

      // float duration (16s ~ 24s)
      const duration = 16 + (wish.id.charCodeAt(0) % 9);

      // delay (새로 추가된 첫 번째 항목은 0초로 즉시 출발)
      const delay = index === 0 ? 0.2 : (index * 2.8) % 12;

      return {
        wish,
        xPercent,
        duration,
        delay,
      };
    });
  }, [countryWishes]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between select-none">
      {/* 상단 네비게이션 바 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-5 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent backdrop-blur-sm"
      >
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={onBackToMap}
          className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/70 hover:border-violet-400/50 text-slate-300 hover:text-white transition-all duration-200 shadow-lg active:scale-95 text-xs sm:text-sm font-medium"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>세계 지도로 돌아가기</span>
        </button>

        {/* 현재 국가 타이틀 정보 */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{countryInfo.flag}</span>
            <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              {countryInfo.name} 상공
            </h1>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-violet-300 font-medium">
            <Sparkles size={12} className="text-amber-300" />
            <span>밤하늘에 떠오른 소원</span>
            <span className="font-bold text-amber-300 ml-0.5 bg-violet-950/80 px-2 py-0.2 rounded-full border border-violet-500/30">
              {countryWishes.length}개
            </span>
          </div>
        </div>

        {/* 빈 공간 균형용 더미 또는 상단 미니 로고 */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-serif opacity-75">
          <span>SowonSky</span>
        </div>
      </motion.header>

      {/* 밤하늘 중앙 캔버스 영역: 풍선 띄우기 */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {countryWishes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-3xl mb-4 shadow-xl">
              🎈
            </div>
            <p className="text-lg font-semibold text-slate-200">
              아직 {countryInfo.name}의 밤하늘에 띄워진 소원이 없어요.
            </p>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              우측 하단의 ‘소원 띄우기’ 버튼을 눌러 첫 번째 소원의 주인공이 되어보세요!
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {balloonConfigs.map(({ wish, xPercent, duration, delay }) => (
              <Balloon
                key={wish.id}
                wish={wish}
                onClick={onSelectWish}
                floatDuration={duration}
                delay={delay}
                xPercent={xPercent}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 우하단 플로팅 액션 버튼 (FAB) */}
      <div className="fixed bottom-8 right-8 z-40">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={onOpenWriteModal}
          className="flex items-center gap-2.5 px-6 py-4 rounded-full font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-pink-200 to-violet-300 hover:from-amber-100 hover:to-violet-200 shadow-[0_0_35px_rgba(251,191,36,0.4)] border border-white/60 transition-all duration-300"
        >
          <span className="text-xl">🎈</span>
          <span className="text-sm sm:text-base tracking-wide">소원 띄우기</span>
          <Plus size={18} className="stroke-[3]" />
        </motion.button>
      </div>
    </div>
  );
}

