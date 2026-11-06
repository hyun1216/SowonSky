'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Plus, Loader2, Coffee } from 'lucide-react';
import { WishWithTimer, CountryInfo } from '../types/wish';
import Balloon from './Balloon';
import WishDetailModal from './WishDetailModal';
import WishWriteModal from './WishWriteModal';
import DonationModal from './DonationModal';
import { KNOWN_COUNTRIES } from '../data/mockWishes';
import { useRealtimeWishes } from '../hooks/useRealtimeWishes';

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
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    return res;
  };

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between select-none">
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

        {/* 현재 국가 정보 */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{countryInfo.flag}</span>
            <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              {countryInfo.name} 상공
            </h1>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-violet-300 font-medium">
            <Sparkles size={12} className="text-amber-300" />
            <span>12시간 이내 뜬 소원</span>
            <span className="font-bold text-amber-300 ml-0.5 bg-violet-950/80 px-2 py-0.2 rounded-full border border-violet-500/30">
              {wishes.length}개
            </span>
          </div>

          {/* 소원 정렬 필터 바 (최신순 / 인기순) */}
          <div className="flex items-center gap-1 mt-2.5 p-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-inner">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                sortBy === 'latest'
                  ? 'bg-violet-600/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortBy('cheer')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                sortBy === 'cheer'
                  ? 'bg-rose-500/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>❤️ 인기순</span>
            </button>
          </div>
        </div>

        {/* 우측 후원 버튼 & 실시간 배지 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDonationReason('GENERAL');
              setIsDonationModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 hover:border-amber-400/60 text-xs font-semibold text-amber-300 transition-all shadow-md active:scale-95"
            title="커피 한 잔 후원하기"
          >
            <Coffee size={13} className="text-amber-300" />
            <span className="hidden sm:inline">커피 선물</span>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>실시간</span>
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
                onClick={(clicked) => setSelectedWish(clicked)}
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
      <div className="fixed bottom-8 right-8 z-40">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsWriteModalOpen(true)}
          className="flex items-center gap-2.5 px-6 py-4 rounded-full font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-pink-200 to-violet-300 hover:from-amber-100 hover:to-violet-200 shadow-[0_0_35px_rgba(251,191,36,0.4)] border border-white/60 transition-all duration-300"
        >
          <span className="text-xl">🎈</span>
          <span className="text-sm sm:text-base tracking-wide">소원 띄우기</span>
          <Plus size={18} className="stroke-[3]" />
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
