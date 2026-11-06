'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, Heart, ExternalLink, Sparkles } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'LIMIT_REACHED' | 'GENERAL';
}

export default function DonationModal({
  isOpen,
  onClose,
  reason = 'GENERAL',
}: DonationModalProps) {
  if (!isOpen) return null;

  // 후원 링크
  const bmacUrl = 'https://buymeacoffee.com/devom';

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

        {/* 모달 창 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900/95 border border-amber-500/30 p-7 shadow-2xl z-10 backdrop-blur-2xl overflow-hidden text-center"
          style={{
            boxShadow: '0 0 50px -10px rgba(251, 191, 36, 0.25)',
          }}
        >
          {/* 상단 앰비언트 글로우 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
            aria-label="닫기"
          >
            <X size={20} />
          </button>

          {/* 아이콘 */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-violet-500/20 border border-amber-400/40 text-3xl mb-4 shadow-xl">
            ☕
          </div>

          {/* 타이틀 및 안내 */}
          <div className="mb-6">
            {reason === 'LIMIT_REACHED' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
                <Sparkles size={12} className="text-amber-400" />
                <span>오늘의 소원 2회를 모두 띄우셨어요</span>
              </div>
            )}
            <h2 className="text-2xl font-bold text-white tracking-tight">
              소원하늘 응원하기
            </h2>
            <p className="text-sm text-slate-300 mt-2.5 leading-relaxed font-light px-2">
              “소원하늘의 밤하늘이 계속 반짝일 수 있도록<br />
              <span className="font-semibold text-amber-200">따뜻한 커피 한 잔</span>을 선물해주세요.”
            </p>
            <p className="text-xs text-slate-400 mt-2">
              보내주신 소중한 후원은 서버 유지비와 서비스 운영에 전액 사용됩니다.
            </p>
          </div>

          {/* 후원 버튼 */}
          <div className="pt-2">
            {/* Buy Me a Coffee 버튼 (단독 메인) */}
            <a
              href={bmacUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FFDD00] via-[#FACC15] to-[#F59E0B] hover:brightness-105 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <Coffee size={21} className="text-slate-950 stroke-[2.5]" />
                <span>Buy Me a Coffee로 응원하기</span>
              </div>
              <ExternalLink size={18} className="text-slate-900 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* 하단 감사 메시지 */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Heart size={13} className="text-rose-400 fill-rose-400/50" />
            <span>당신의 따뜻한 마음에 진심으로 감사드립니다.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

