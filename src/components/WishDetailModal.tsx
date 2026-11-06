'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Calendar, MapPin, Clock } from 'lucide-react';
import { WishWithTimer } from '../types/wish';
import { getBalloonColorConfig } from '../data/mockWishes';

interface WishDetailModalProps {
  wish: WishWithTimer | null;
  onClose: () => void;
  onCheer: (id: string) => void;
}

export default function WishDetailModal({ wish, onClose, onCheer }: WishDetailModalProps) {
  const [isCheered, setIsCheered] = useState(false);
  const [heartPops, setHeartPops] = useState<{ id: number; x: number; y: number }[]>([]);

  if (!wish) return null;

  const colorConfig = getBalloonColorConfig(wish.balloon_color);

  const handleCheerClick = () => {
    onCheer(wish.id);
    setIsCheered(true);

    const newPop = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 40,
      y: -30 - Math.random() * 30,
    };
    setHeartPops((prev) => [...prev, newPop]);

    setTimeout(() => {
      setHeartPops((prev) => prev.filter((p) => p.id !== newPop.id));
    }, 1000);
  };

  const createdFormatted = wish.created_at
    ? new Date(wish.created_at).toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 배경 오버레이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* 팝업 카드 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-700/80 p-7 shadow-2xl overflow-hidden z-10 backdrop-blur-xl"
          style={{
            boxShadow: `0 0 40px -10px ${colorConfig.hex}40`,
          }}
        >
          {/* 상단 은은한 배경 광채 */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full blur-3xl pointer-events-none opacity-30"
            style={{ backgroundColor: colorConfig.hex }}
          />

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
            aria-label="닫기"
          >
            <X size={20} />
          </button>

          {/* 국가 및 태그 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-300">
              <MapPin size={12} className="text-violet-400" />
              {wish.country_name}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border"
              style={{
                backgroundColor: `${colorConfig.hex}20`,
                borderColor: `${colorConfig.hex}60`,
                color: colorConfig.hex,
              }}
            >
              <Sparkles size={11} />
              {colorConfig.name}
            </span>
          </div>

          {/* 소원 본문 */}
          <div className="my-6">
            <div className="relative p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <span className="absolute -top-3 left-4 text-2xl text-slate-500 font-serif select-none">“</span>
              <p className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed tracking-wide pt-1">
                {wish.content}
              </p>
              <span className="absolute -bottom-5 right-4 text-2xl text-slate-500 font-serif select-none">”</span>
            </div>
          </div>

          {/* 작성일 및 남은 시간 카운트다운 */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-6 px-1">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} />
              <span>{createdFormatted} 띄움</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
              <Clock size={12} className="text-amber-400" />
              <span>터지기까지 {wish.remainingTimeFormatted}</span>
            </div>
          </div>

          {/* 액션 버튼 영역 */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              {heartPops.map((pop) => (
                <motion.div
                  key={pop.id}
                  initial={{ opacity: 1, scale: 0.8, x: pop.x, y: 0 }}
                  animate={{ opacity: 0, scale: 1.5, y: pop.y }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute left-1/2 bottom-12 pointer-events-none text-rose-400 font-bold text-xl select-none"
                >
                  ❤️ +1
                </motion.div>
              ))}

              <button
                onClick={handleCheerClick}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-semibold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 shadow-lg shadow-rose-500/25 active:scale-95 transition-all duration-200"
              >
                <Heart
                  size={19}
                  className={`transition-transform duration-300 ${isCheered ? 'scale-125 fill-white text-white' : 'fill-rose-200/40'}`}
                />
                <span>소원 응원하기</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold ml-1">
                  {wish.cheer_count ?? 0}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
