'use client';

import React, { useMemo } from 'react';

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

export default function BackgroundStars() {
  // 고정된 결정론적 별 생성 (Hydration mismatch 방지)
  const stars: Star[] = useMemo(() => {
    const list: Star[] = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      // 의사 난수 생성
      const pseudoX = (Math.sin(i * 997) * 10000) % 1;
      const pseudoY = (Math.cos(i * 353) * 10000) % 1;
      const pseudoSize = (Math.sin(i * 571) * 10000) % 1;
      const pseudoDuration = (Math.cos(i * 733) * 10000) % 1;
      const pseudoDelay = (Math.sin(i * 123) * 10000) % 1;

      list.push({
        id: i,
        top: Math.abs(pseudoY) * 100,
        left: Math.abs(pseudoX) * 100,
        size: Math.abs(pseudoSize) > 0.85 ? 3 : Math.abs(pseudoSize) > 0.5 ? 2 : 1.5,
        opacity: 0.3 + Math.abs(pseudoSize) * 0.7,
        delay: Math.abs(pseudoDelay) * 5,
        duration: 2.5 + Math.abs(pseudoDuration) * 4,
      });
    }
    return list;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 몽환적인 오로라 & 새벽빛 그라데이션 광원 */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-900/15 blur-[120px]" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-900/15 blur-[130px]" />
      <div className="absolute bottom-[-15%] left-[25%] w-[55vw] h-[55vw] rounded-full bg-purple-900/10 blur-[140px]" />

      {/* 반짝이는 별빛 */}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white transition-opacity"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: star.size > 2 ? '0 0 8px 1px rgba(255, 255, 255, 0.8)' : undefined,
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* 은은한 별똥별 효과 */}
      <div className="shooting-star shooting-star-1" />
      <div className="shooting-star shooting-star-2" />
    </div>
  );
}

