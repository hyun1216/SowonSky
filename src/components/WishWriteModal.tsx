'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Check, AlertCircle, Coffee } from 'lucide-react';
import { BALLOON_PALETTE, getBalloonColorConfig } from '../data/mockWishes';
import { getTodayWishCount, MAX_DAILY_WISHES } from '../lib/wishLimit';

interface WishWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, balloonColorHex: string) => Promise<{ success: boolean; error?: string; isLimitReached?: boolean }>;
  onOpenDonation: () => void;
  selectedCountry: { code: string; name: string };
}

export default function WishWriteModal({
  isOpen,
  onClose,
  onSubmit,
  onOpenDonation,
  selectedCountry,
}: WishWriteModalProps) {
  const [content, setContent] = useState('');
  const [selectedHex, setSelectedHex] = useState<string>('#F472B6');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [todayCount, setTodayCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setTodayCount(getTodayWishCount());
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentColor = getBalloonColorConfig(selectedHex);
  const maxLen = 100;
  const isLimitReached = todayCount >= MAX_DAILY_WISHES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting || isLimitReached) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await onSubmit(content.trim(), selectedHex);

    setIsSubmitting(false);

    if (result.success) {
      setContent('');
      onClose();
    } else {
      setErrorMessage(result.error || '소원을 띄우지 못했습니다.');
      if (result.isLimitReached) {
        setTodayCount(MAX_DAILY_WISHES);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 어두운 배경 오버레이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* 모달 창 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 border border-slate-700/80 p-7 shadow-2xl z-10 backdrop-blur-2xl overflow-hidden"
          style={{
            boxShadow: `0 0 50px -15px ${currentColor.hex}40`,
          }}
        >
          {/* 상단 앰비언트 글로우 */}
          <div
            className="absolute top-0 right-1/4 w-52 h-32 rounded-full blur-3xl pointer-events-none opacity-30 transition-all duration-500"
            style={{ backgroundColor: currentColor.hex }}
          />

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
            aria-label="닫기"
          >
            <X size={20} />
          </button>

          {/* 타이틀 헤더 */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xl">🎈</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300">
                {selectedCountry.name} 밤하늘
              </span>

              {/* 하루 2회 소원 카운터 뱃지 */}
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                isLimitReached
                  ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}>
                오늘의 소원: {todayCount}/{MAX_DAILY_WISHES}회
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              소원 풍선 띄우기
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              마음속 소망을 담아 밤하늘로 띄워보세요. 12시간 동안 밤하늘을 환하게 밝힙니다.
            </p>
          </div>

          {/* 하루 한도 초과 알림 및 후원 제안 */}
          {isLimitReached ? (
            <div className="my-5 p-5 rounded-2xl bg-slate-800/60 border border-amber-500/30 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xl mx-auto">
                🌙
              </div>
              <h3 className="text-base font-bold text-slate-100">
                오늘의 소원을 모두 띄우셨어요
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                더 많은 분들의 소중한 꿈이 밤하늘에 닿을 수 있도록 하루 최대 2회로 제한됩니다. 내일 자정 이후 다시 찾아와주세요!
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDonation();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 text-xs font-semibold transition-all shadow-md active:scale-95"
              >
                <Coffee size={14} className="text-amber-300" />
                <span>따뜻한 커피 한 잔 선물하기</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 오류 메시지 배너 */}
              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs animate-shake">
                  <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                  <p className="leading-snug">{errorMessage}</p>
                </div>
              )}

              {/* 소원 입력 텍스트에어리어 */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
                  <span>한 줄 소원</span>
                  <span className={`text-[11px] ${content.length > maxLen ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                    {content.length}/{maxLen}자
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value.slice(0, maxLen));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="예: 지친 마음에 잔잔한 평온이 깃들기를..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400/60 transition-all resize-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* 풍선 색상 팔레트 선택 */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>풍선 색상 선택</span>
                </label>
                <div className="grid grid-cols-5 gap-2.5">
                  {BALLOON_PALETTE.map((item) => {
                    const isSelected = selectedHex === item.hex;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setSelectedHex(item.hex)}
                        className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-200 group ${
                          isSelected
                            ? 'border-white bg-slate-800/80 scale-105 shadow-lg'
                            : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/40 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-full shadow-inner flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: item.hex,
                            boxShadow: isSelected ? `0 0 12px ${item.hex}` : undefined,
                          }}
                        >
                          {isSelected && <Check size={14} className="text-slate-950 font-bold stroke-[3]" />}
                        </div>
                        <span className="text-[10px] text-slate-300 font-medium text-center truncate w-full">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl ${
                    content.trim() && !isSubmitting
                      ? 'text-slate-950 bg-gradient-to-r from-violet-200 via-pink-200 to-amber-200 hover:brightness-110 hover:shadow-violet-500/25 active:scale-[0.98]'
                      : 'bg-slate-800/70 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? '하늘로 띄우는 중...' : '하늘로 날리기'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
