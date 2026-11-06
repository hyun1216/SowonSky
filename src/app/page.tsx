'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundStars from '../components/BackgroundStars';
import WorldMapView from '../components/WorldMapView';
import SkyView from '../components/SkyView';
import WishDetailModal from '../components/WishDetailModal';
import WishWriteModal from '../components/WishWriteModal';
import { Wish } from '../types/wish';
import { INITIAL_WISHES } from '../data/mockWishes';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'map' | 'sky'>('map');
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string } | null>(null);
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  // 국가 선택 시 'sky' 뷰로 부드럽게 이동
  const handleSelectCountry = (country: { code: string; name: string }) => {
    setSelectedCountry(country);
    setViewMode('sky');
  };

  // 'sky' 뷰에서 지도로 돌아가기
  const handleBackToMap = () => {
    setViewMode('map');
  };

  // 소원 응원하기 (+1)
  const handleCheerWish = (wishId: string) => {
    setWishes((prev) =>
      prev.map((item) =>
        item.id === wishId ? { ...item, cheerCount: item.cheerCount + 1 } : item
      )
    );

    // 열려있는 상세 모달의 정보도 즉시 동기화
    setSelectedWish((prev) =>
      prev && prev.id === wishId ? { ...prev, cheerCount: prev.cheerCount + 1 } : prev
    );
  };

  // 새 소원 등록
  const handleCreateWish = (newWishData: Omit<Wish, 'id' | 'cheerCount' | 'createdAt'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newWish: Wish = {
      ...newWishData,
      id: `wish-${Date.now()}`,
      cheerCount: 0,
      createdAt: formattedDate,
    };

    // 새 풍선이 바로 화면 아래에서 둥실 떠오르도록 리스트의 가장 앞에 추가
    setWishes((prev) => [newWish, ...prev]);
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
            <WorldMapView
              wishes={wishes}
              onSelectCountry={handleSelectCountry}
            />
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
                wishes={wishes}
                onBackToMap={handleBackToMap}
                onOpenWriteModal={() => setIsWriteModalOpen(true)}
                onSelectWish={(wish) => setSelectedWish(wish)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 소원 상세 모달 */}
      {selectedWish && (
        <WishDetailModal
          wish={selectedWish}
          onClose={() => setSelectedWish(null)}
          onCheer={handleCheerWish}
        />
      )}

      {/* 소원 작성 모달 */}
      {selectedCountry && (
        <WishWriteModal
          isOpen={isWriteModalOpen}
          onClose={() => setIsWriteModalOpen(false)}
          onSubmit={handleCreateWish}
          selectedCountry={selectedCountry}
        />
      )}
    </main>
  );
}

