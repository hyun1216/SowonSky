'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundStars from '../components/BackgroundStars';
import WorldMapView from '../components/WorldMapView';
import SkyView from '../components/SkyView';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'map' | 'sky'>('map');
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string } | null>(null);

  // 국가 선택 시 'sky' 뷰로 부드럽게 이동
  const handleSelectCountry = (country: { code: string; name: string }) => {
    setSelectedCountry(country);
    setViewMode('sky');
  };

  // 'sky' 뷰에서 지도로 복귀
  const handleBackToMap = () => {
    setViewMode('map');
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 은은하게 반짝이는 별빛 및 몽환적인 새벽빛 배경 */}
      <BackgroundStars />

      {/* 화면 전환 래퍼 */}
      <AnimatePresence mode="wait">
        {viewMode === 'map' ? (
          <motion.div
            key="map-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="w-full min-h-screen flex flex-col justify-center"
          >
            <WorldMapView onSelectCountry={handleSelectCountry} />
          </motion.div>
        ) : (
          <motion.div
            key="sky-view"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="w-full h-screen"
          >
            {selectedCountry && (
              <SkyView
                selectedCountry={selectedCountry}
                onBackToMap={handleBackToMap}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
