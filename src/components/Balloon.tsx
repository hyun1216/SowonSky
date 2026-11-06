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
  initialYPercent?: number; // 40 ~ 110
  isPopping?: boolean;
}

export default function Balloon({
  wish,
  onClick,
  floatDuration = 16,
  delay = 0,
  xPercent,
  initialYPercent = 105,
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
          <div
            className="w-12 h-12 rounded-full blur-md animate-ping"
            style={{ backgroundColor: colorConfig.hex }}
          />
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
          initial={{ y: `${initialYPercent}vh`, opacity: 0 }}
          animate={{
            // 화면 맨 위 끝 너머(-115vh)까지 온전히 비행
            y: '-115vh',
            // 비행 중 거의 내내 opacity 1 유지, 맨 위를 완전히 벗어날 때만 사라짐
            opacity: [0, 1, 1, 1, 1, 0],
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            duration: floatDuration,
            delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.05, 0.3, 0.8, 0.94, 1],
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
              x: [-10, 10, -6, 8, -10],
              rotate: [-3, 4, -2, 3, -3],
            }}
            transition={{
              duration: 4.5 + (wish.id.charCodeAt(wish.id.length - 1) % 3),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
            className="flex flex-col items-center"
          >
            {/* 풍선 본체 SVG */}
            <div className="relative">
              <svg
                width="76"
                height="92"
                viewBox="0 0 84 102"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.7)] transition-all duration-300"
              >
                <defs>
                  <radialGradient
                    id={`balloon-grad-${wish.id}`}
                    cx="35%"
                    cy="30%"
                    r="70%"
                    fx="28%"
                    fy="22%"
                  >
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="25%" stopColor={colorConfig.hex} stopOpacity="0.95" />
                    <stop offset="85%" stopColor={colorConfig.hex} stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0.4" />
                  </radialGradient>

                  <linearGradient id={`knot-grad-${wish.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={colorConfig.hex} />
                    <stop offset="100%" stopColor="#1E1B4B" />
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
                  fillOpacity="0.4"
                />
                <circle cx="22" cy="18" r="3.5" fill="#FFFFFF" fillOpacity="0.6" />

                {/* 매듭 (Knot) */}
                <path
                  d="M38 88 L46 88 L44 93 L47 95 L37 95 L40 93 Z"
                  fill={`url(#knot-grad-${wish.id})`}
                />

                {/* 풍선 실 (String) */}
                <path
                  d="M42 95 Q39 108, 43 118 T42 130"
                  stroke="rgba(226, 232, 240, 0.55)"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </div>

            {/* 고대비 소원 카드 태그 (가독성 극대화) */}
            <div className="mt-1 w-36 sm:w-44 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-[0_8px_20px_rgba(0,0,0,0.6)] backdrop-blur-md group-hover:border-violet-400/70 group-hover:bg-slate-900/95 transition-all duration-200">
              <p className="text-xs sm:text-[13px] font-semibold text-slate-100 line-clamp-2 leading-snug tracking-tight text-center drop-shadow-sm">
                {wish.content}
              </p>

              <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-300">
                <span className="flex items-center gap-1 font-medium">
                  <span className="text-rose-400">❤️</span>
                  <span className="text-white font-bold">{wish.cheer_count ?? 0}</span>
                </span>
                <span className="flex items-center gap-1 font-mono text-amber-300">
                  <Clock size={10} className="text-amber-400" />
                  <span>{wish.remainingTimeFormatted}</span>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
