'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WishWithTimer } from '../types/wish';
import { getBalloonColorConfig } from '../data/mockWishes';
import { Clock } from 'lucide-react';

interface BalloonProps {
  wish: WishWithTimer;
  onClick: (wish: WishWithTimer) => void;
  floatDuration?: number;
  delay?: number;
  xPercent: number; // 5% ~ 90%
  isPopping?: boolean;
}

export default function Balloon({
  wish,
  onClick,
  floatDuration = 20,
  delay = 0,
  xPercent,
  isPopping = false,
}: BalloonProps) {
  const colorConfig = getBalloonColorConfig(wish.balloon_color);

  return (
    <AnimatePresence>
      {isPopping ? (
        // 펑 터지는 별가루 파티클 애니메이션
        <motion.div
          key={`pop-${wish.id}`}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            left: `${xPercent}%`,
            position: 'absolute',
            bottom: '40%',
            zIndex: 30,
          }}
          className="pointer-events-none select-none flex items-center justify-center"
        >
          {/* 중앙 빛의 폭발 */}
          <div
            className="w-12 h-12 rounded-full blur-md animate-ping"
            style={{ backgroundColor: colorConfig.hex }}
          />
          {/* 8방향 별가루 파티클 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const dist = 45 + (i % 3) * 15;
            return (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(rad) * dist,
                  y: Math.sin(rad) * dist,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute text-xs"
              >
                ✨
              </motion.span>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          key={`float-${wish.id}`}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{
            y: '-30vh',
            opacity: [0, 1, 1, 0.95, 0],
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            duration: floatDuration,
            delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            left: `${xPercent}%`,
            position: 'absolute',
            bottom: 0,
            zIndex: 10,
          }}
          className="cursor-pointer group select-none"
          onClick={() => onClick(wish)}
        >
          {/* 살랑살랑 좌우 흔들리는 swaying 래퍼 */}
          <motion.div
            animate={{
              x: [-12, 12, -8, 10, -12],
              rotate: [-4, 5, -3, 4, -4],
            }}
            transition={{
              duration: 5 + (wish.id.charCodeAt(wish.id.length - 1) % 4),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.12, transition: { duration: 0.2 } }}
            className="flex flex-col items-center"
          >
            {/* 풍선 본체 SVG */}
            <div className="relative">
              <svg
                width="84"
                height="102"
                viewBox="0 0 84 102"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.7)] transition-all duration-300"
              >
                <defs>
                  {/* 풍선 3D 구체형 그라데이션 */}
                  <radialGradient
                    id={`balloon-grad-${wish.id}`}
                    cx="35%"
                    cy="30%"
                    r="70%"
                    fx="28%"
                    fy="22%"
                  >
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                    <stop offset="25%" stopColor={colorConfig.hex} stopOpacity="0.95" />
                    <stop offset="85%" stopColor={colorConfig.hex} stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.35" />
                  </radialGradient>

                  {/* 매듭 그라데이션 */}
                  <linearGradient id={`knot-grad-${wish.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={colorConfig.hex} />
                    <stop offset="100%" stopColor="#312E81" />
                  </linearGradient>
                </defs>

                {/* 풍선 몸체 타원 */}
                <path
                  d="M42 4 C64 4, 80 24, 80 50 C80 73, 56 86, 44 88 C43 88.2, 41 88.2, 40 88 C28 86, 4 73, 4 50 C4 24, 20 4, 42 4 Z"
                  fill={`url(#balloon-grad-${wish.id})`}
                />

                {/* 하이라이트 광택 타원 */}
                <ellipse
                  cx="28"
                  cy="30"
                  rx="12"
                  ry="20"
                  transform="rotate(-25 28 30)"
                  fill="#FFFFFF"
                  fillOpacity="0.35"
                />
                <circle cx="22" cy="18" r="3.5" fill="#FFFFFF" fillOpacity="0.55" />

                {/* 매듭 (Knot) */}
                <path
                  d="M38 88 L46 88 L44 93 L47 95 L37 95 L40 93 Z"
                  fill={`url(#knot-grad-${wish.id})`}
                />

                {/* 풍선 실 (String) 곡선 */}
                <path
                  d="M42 95 Q38 108, 44 120 T40 138"
                  stroke="rgba(226, 232, 240, 0.45)"
                  strokeWidth="1.2"
                  fill="none"
                  strokeDasharray="2 1"
                />
              </svg>

              {/* 소원 내용 미니 프리뷰 */}
              <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] text-center pointer-events-none px-1">
                <p className="text-[10px] font-medium text-slate-900/90 line-clamp-2 leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                  {wish.content}
                </p>
              </div>
            </div>

            {/* 하단 미니 배지: 남은 시간 카운트다운 & 응원 수 */}
            <div className="mt-7 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-slate-700/60 shadow-lg text-[10px] text-slate-300 group-hover:border-violet-400/70 group-hover:text-white transition-colors">
                <span className="text-rose-400">❤️</span>
                <span className="font-semibold">{wish.cheer_count ?? 0}</span>
                <span className="text-slate-600">|</span>
                <Clock size={10} className="text-amber-400" />
                <span className="font-mono text-[9px] text-amber-200">
                  {wish.remainingTimeFormatted}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
