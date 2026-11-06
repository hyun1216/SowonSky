'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Check } from 'lucide-react';
import { BalloonColor, Wish } from '../types/wish';
import { BALLOON_COLOR_MAP } from '../data/mockWishes';

interface WishWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newWish: Omit<Wish, 'id' | 'cheerCount' | 'createdAt'>) => void;
  selectedCountry: { code: string; name: string };
}

const PALETTE: { key: BalloonColor; label: string }[] = [
  { key: 'pink', label: '소프트 핑크' },
  { key: 'lavender', label: '라벤더' },
  { key: 'sky', label: '스카이블루' },
  { key: 'mint', label: '민트' },
  { key: 'yellow', label: '파스텔 옐로우' },
];

export default function WishWriteModal({
  isOpen,
  onClose,
  onSubmit,
  selectedCountry,
}: WishWriteModalProps) {
  const [content, setContent] = useState('');
  const [balloonColor, setBalloonColor] = useState<BalloonColor>('pink');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentColor = BALLOON_COLOR_MAP[balloonColor];
  const maxLen = 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    onSubmit({
      content: content.trim(),
      balloonColor,
      countryCode: selectedCountry.code,
      countryName: selectedCountry.name,
    });

    setContent('');
    setIsSubmitting(false);
    onClose();
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
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">🎈</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300">
                {selectedCountry.name} 밤하늘
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              소원 풍선 띄우기
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              마음속 깊이 간직한 소망을 한 줄로 담아 밤하늘로 띄워보세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={(e) => setContent(e.target.value.slice(0, maxLen))}
                  placeholder="예: 우리 가족 모두 건강하고, 마음에 평온이 깃들기를..."
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
                {PALETTE.map((item) => {
                  const cfg = BALLOON_COLOR_MAP[item.key];
                  const isSelected = balloonColor === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setBalloonColor(item.key)}
                      className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-200 group ${
                        isSelected
                          ? 'border-white bg-slate-800/80 scale-105 shadow-lg'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      {/* 컬러 원형 프리뷰 */}
                      <div
                        className="w-7 h-7 rounded-full shadow-inner flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: cfg.hex,
                          boxShadow: isSelected ? `0 0 12px ${cfg.hex}` : undefined,
                        }}
                      >
                        {isSelected && <Check size={14} className="text-slate-950 font-bold stroke-[3]" />}
                      </div>
                      <span className="text-[10px] text-slate-300 font-medium text-center truncate w-full">
                        {item.label}
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
                disabled={!content.trim()}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl ${
                  content.trim()
                    ? 'text-slate-950 bg-gradient-to-r from-violet-200 via-pink-200 to-amber-200 hover:brightness-110 hover:shadow-violet-500/25 active:scale-[0.98]'
                    : 'bg-slate-800/70 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                <Send size={16} />
                <span>하늘로 날리기</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

