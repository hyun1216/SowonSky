'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Plus, Loader2, Coffee, Volume2, VolumeX } from 'lucide-react';
import { WishWithTimer, CountryInfo } from '../types/wish';
import Balloon from './Balloon';
import WishDetailModal from './WishDetailModal';
import WishWriteModal from './WishWriteModal';
import DonationModal from './DonationModal';
import { KNOWN_COUNTRIES } from '../data/mockWishes';
import { useRealtimeWishes } from '../hooks/useRealtimeWishes';
import { soundManager } from '../lib/soundEffects';

interface SkyViewProps {
  selectedCountry: { code: string; name: string };
  onBackToMap: () => void;
}

export default function SkyView({ selectedCountry, onBackToMap }: SkyViewProps) {
  const {
    wishes,
    poppingWishIds,
    isLoading,
    addWish,
    cheerWish,
  } = useRealtimeWishes(selectedCountry.code, selectedCountry.name);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationReason, setDonationReason] = useState<'LIMIT_REACHED' | 'GENERAL'>('GENERAL');
  const [selectedWish, setSelectedWish] = useState<WishWithTimer | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'cheer'>('latest');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  useEffect(() => {
    setIsSoundOn(soundManager.getSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const next = soundManager.toggleSound();
    setIsSoundOn(next);
  };

  const countryInfo: CountryInfo =
    KNOWN_COUNTRIES[selectedCountry.code] || {
      code: selectedCountry.code,
      name: selectedCountry.name,
      flag: '🌍',
      englishName: selectedCountry.name,
    };

  // 정렬된 소원 목록
  const sortedWishes = useMemo(() => {
    const list = [...wishes];
    if (sortBy === 'cheer') {
      return list.sort((a, b) => (b.cheer_count ?? 0) - (a.cheer_count ?? 0));
    }
    // 기본값: 최신순 (created_at 내림차순)
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [wishes, sortBy]);

  const balloonConfigs = useMemo(() => {
    // 초기 화면 진입 시 풍선들이 화면 중간~하단에서 시작하여 맨 위까지 길게 비행하도록 설정
    const initialYOffsets = [60, 85, 100, 70, 90, 105, 75, 95];

    return sortedWishes.map((wish, index) => {
      const slotWidth = 74 / Math.max(sortedWishes.length, 1);
      const baseX = 12 + index * slotWidth;
      const jitter = ((wish.id.charCodeAt(wish.id.length - 1) * 7) % 8) - 4;
      const xPercent = Math.min(86, Math.max(10, baseX + jitter));

      // 맨 위 끝까지 온전히 비행하는 적정 속도: 15초 ~ 18초
      const duration = 15 + (wish.id.charCodeAt(0) % 4);

      // 딜레이 최소화
      const delay = index === 0 ? 0 : (index * 0.4) % 2;

      // 새로 띄운 소원은 화면 맨 아래(105vh)에서 출발, 기존 소원들은 60~105vh에서 순차 출발
      const initialYPercent = index === 0 ? 105 : initialYOffsets[index % initialYOffsets.length];

      return {
        wish,
        xPercent,
        duration,
        delay,
        initialYPercent,
        isPopping: poppingWishIds.has(wish.id),
      };
    });
  }, [sortedWishes, poppingWishIds]);

  const activeSelectedWish = useMemo(() => {
    if (!selectedWish) return null;
    return wishes.find((w) => w.id === selectedWish.id) || selectedWish;
  }, [selectedWish, wishes]);

  // 소원 날리기 성공 시 축하 모션 핸들러
  const handleWishSubmit = async (content: string, balloonColorHex: string) => {
    const res = await addWish(content, balloonColorHex);
    if (res.success) {
      soundManager.playWishChime();
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    return res;
  };

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between select-none">
      {/* 상단 네비게이션 바 (반응형 최적화) */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 flex flex-col gap-2 px-3 sm:px-8 py-3 sm:py-5 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent backdrop-blur-md"
      >
        {/* 1행: 메인 바 (뒤로가기 - 국가명 - 액션 버튼) */}
        <div className="flex items-center justify-between w-full">
          {/* 뒤로 가기 버튼 (모바일: 콤팩트 아이콘 / PC: 텍스트 포함) */}
          <button
            onClick={onBackToMap}
            className="group flex items-center gap-2 p-2 sm:px-4 sm:py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-violet-400/50 text-slate-300 hover:text-white transition-all shadow-md active:scale-95 text-xs sm:text-sm font-medium shrink-0"
            title="세계 지도로 돌아가기"
            aria-label="세계 지도로 돌아가기"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">세계 지도로 돌아가기</span>
          </button>

          {/* 중앙: 국가 타이틀 */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 text-center truncate">
            <span className="text-lg sm:text-2xl shrink-0">{countryInfo.flag}</span>
            <h1 className="text-base sm:text-2xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] truncate">
              {countryInfo.name} 상공
            </h1>
          </div>

          {/* 우측: 사운드 토글 & 후원 버튼 */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 사운드 ON/OFF 버튼 */}
            <button
              onClick={handleToggleSound}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-violet-400/50 text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
              title={isSoundOn ? '소리 끄기' : '소리 켜기'}
              aria-label="소리 토글"
            >
              {isSoundOn ? <Volume2 size={15} className="text-violet-300" /> : <VolumeX size={15} className="text-slate-500" />}
            </button>

            {/* 커피 선물 버튼 */}
            <button
              onClick={() => {
                setDonationReason('GENERAL');
                setIsDonationModalOpen(true);
              }}
              className="flex items-center gap-1 sm:gap-1.5 p-2 sm:px-3 sm:py-2 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 hover:border-amber-400/60 text-xs font-semibold text-amber-300 transition-all shadow-md active:scale-95"
              title="커피 한 잔 후원하기"
              aria-label="커피 선물"
            >
              <Coffee size={14} className="text-amber-300" />
              <span className="hidden sm:inline">커피 선물</span>
            </button>

            {/* PC 전용 실시간 뱃지 */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>실시간</span>
            </div>
          </div>
        </div>

        {/* 2행: 서브 바 (12시간 소원 수 카운터 & 정렬 필터 칩) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 w-full pt-0.5">
          {/* 소원 카운트 뱃지 */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] sm:text-xs text-violet-300 font-medium shrink-0">
            <Sparkles size={11} className="text-amber-300 shrink-0" />
            <span className="hidden xs:inline">12시간 뜬 소원</span>
            <span className="xs:hidden">소원</span>
            <span className="font-bold text-amber-300 ml-0.5 bg-violet-950/80 px-1.5 py-0.2 rounded-full border border-violet-500/30">
              {wishes.length}개
            </span>
          </div>

          {/* 소원 정렬 필터 바 (최신순 / 인기순) */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-inner">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all ${
                sortBy === 'latest'
                  ? 'bg-violet-600/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortBy('cheer')}
              className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all flex items-center gap-1 ${
                sortBy === 'cheer'
                  ? 'bg-rose-500/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>❤️ 인기순</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* 밤하늘 중앙 캔버스 영역 */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-400 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-violet-400" />
            <p className="text-sm font-light">밤하늘의 소원을 불러오고 있습니다...</p>
          </div>
        ) : wishes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-3xl mb-4 shadow-xl">
              🎈
            </div>
            <p className="text-lg font-semibold text-slate-200">
              최근 12시간 동안 {countryInfo.name}에 띄워진 소원이 없어요.
            </p>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              우측 하단의 ‘소원 띄우기’ 버튼을 눌러 첫 번째 소원의 주인공이 되어보세요!
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {balloonConfigs.map(({ wish, xPercent, duration, delay, initialYPercent, isPopping }) => (
              <Balloon
                key={wish.id}
                wish={wish}
                onClick={(clicked) => {
                  soundManager.playSelectSound();
                  setSelectedWish(clicked);
                }}
                floatDuration={duration}
                delay={delay}
                xPercent={xPercent}
                initialYPercent={initialYPercent}
                isPopping={isPopping}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 우하단 플로팅 액션 버튼 (FAB) */}
      <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsWriteModalOpen(true)}
          className="flex items-center gap-2 sm:gap-2.5 px-4.5 py-3 sm:px-6 sm:py-4 rounded-full font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-pink-200 to-violet-300 hover:from-amber-100 hover:to-violet-200 shadow-[0_0_35px_rgba(251,191,36,0.4)] border border-white/60 transition-all duration-300"
        >
          <span className="text-lg sm:text-xl">🎈</span>
          <span className="text-xs sm:text-base tracking-wide font-bold">소원 띄우기</span>
          <Plus size={16} className="stroke-[3] sm:w-[18px] sm:h-[18px]" />
        </motion.button>
      </div>

      {/* 소원 날리기 성공 축하 토스트 */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white font-bold text-sm shadow-2xl flex items-center gap-2 border border-white/30 backdrop-blur-md">
              <span className="text-lg">✨</span>
              <span>당신의 소원이 밤하늘로 떠올랐습니다!</span>
              <span className="text-lg">🎈</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 소원 상세 모달 */}
      {activeSelectedWish && (
        <WishDetailModal
          wish={activeSelectedWish}
          onClose={() => setSelectedWish(null)}
          onCheer={(id) => cheerWish(id)}
        />
      )}

      {/* 소원 작성 모달 */}
      <WishWriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handleWishSubmit}
        onOpenDonation={() => {
          setDonationReason('LIMIT_REACHED');
          setIsDonationModalOpen(true);
        }}
        selectedCountry={selectedCountry}
      />

      {/* 커피 후원 모달 */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        reason={donationReason}
      />
    </div>
  );
}
