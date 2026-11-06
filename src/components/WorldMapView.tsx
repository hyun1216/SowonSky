'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { Sparkles, Globe, Compass } from 'lucide-react';
import { Wish, CountryInfo } from '../types/wish';
import { resolveCountry, KNOWN_COUNTRIES } from '../data/mockWishes';

const GEO_URL = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

interface WorldMapViewProps {
  wishes: Wish[];
  onSelectCountry: (country: { code: string; name: string }) => void;
}

export default function WorldMapView({ wishes, onSelectCountry }: WorldMapViewProps) {
  const [tooltip, setTooltip] = useState<{
    country: CountryInfo;
    wishCount: number;
    x: number;
    y: number;
  } | null>(null);

  // 국가별 소원 수 계산
  const getWishCount = (code: string) => {
    return wishes.filter((w) => w.countryCode === code).length;
  };

  // 인기/등록된 국가 칩
  const quickCountries = [
    KNOWN_COUNTRIES.KR,
    KNOWN_COUNTRIES.JP,
    KNOWN_COUNTRIES.US,
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between px-4 py-8 z-10 select-none">
      {/* 상단 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-2xl mx-auto pt-4 pb-2 z-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-violet-300 text-xs font-semibold mb-3 backdrop-blur-md shadow-lg shadow-violet-950/30">
          <Sparkles size={13} className="text-violet-400 animate-pulse" />
          <span>전 세계의 소원이 모이는 밤하늘</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-200 via-indigo-100 to-pink-200 bg-clip-text text-transparent">
          소원하늘 <span className="text-xl md:text-2xl font-light text-violet-300/80">SowonSky</span>
        </h1>
        <p className="mt-2.5 text-sm md:text-base text-slate-400 font-normal">
          하늘을 올려다볼 나라를 선택해보세요
        </p>

        {/* 바로가기 국가 칩 */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
            <Compass size={12} /> 빠른 이동:
          </span>
          {quickCountries.map((c) => {
            const count = getWishCount(c.code);
            return (
              <button
                key={c.code}
                onClick={() => onSelectCountry({ code: c.code, name: c.name })}
                className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 hover:border-violet-400/60 text-xs font-medium text-slate-200 transition-all shadow-md active:scale-95"
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-violet-950/80 text-violet-300 text-[10px] border border-violet-500/30 group-hover:bg-violet-900/90">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.header>

      {/* 지도 컨테이너 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative w-full max-w-5xl my-auto py-2 flex items-center justify-center"
      >
        {/* 지도 뒷배경 링 오라 */}
        <div className="absolute inset-0 bg-radial-gradient from-indigo-900/10 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="w-full aspect-[1.8/1] max-h-[580px] rounded-3xl bg-slate-900/40 border border-slate-800/80 shadow-2xl backdrop-blur-xl p-2 sm:p-4 overflow-hidden relative">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 125,
              center: [10, 20],
            }}
            width={800}
            height={440}
            className="w-full h-full outline-none"
          >
            <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={4}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const geoName = geo.properties.name || '';
                    const country = resolveCountry(geoName, geo.id);
                    const wishCount = getWishCount(country.code);
                    const hasWishes = wishCount > 0;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(e) => {
                          setTooltip({
                            country,
                            wishCount,
                            x: e.clientX,
                            y: e.clientY,
                          });
                        }}
                        onMouseMove={(e) => {
                          setTooltip((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  x: e.clientX,
                                  y: e.clientY,
                                }
                              : null
                          );
                        }}
                        onMouseLeave={() => {
                          setTooltip(null);
                        }}
                        onClick={() => {
                          onSelectCountry({
                            code: country.code,
                            name: country.name,
                          });
                        }}
                        style={{
                          default: {
                            fill: hasWishes ? '#1E293B' : '#0F172A',
                            stroke: hasWishes ? '#6366F1' : '#334155',
                            strokeWidth: hasWishes ? 0.9 : 0.5,
                            outline: 'none',
                            transition: 'all 250ms ease',
                            cursor: 'pointer',
                          },
                          hover: {
                            fill: '#4338CA',
                            stroke: '#A78BFA',
                            strokeWidth: 1.6,
                            outline: 'none',
                            filter: 'drop-shadow(0 0 10px rgba(167, 139, 250, 0.7))',
                            cursor: 'pointer',
                          },
                          pressed: {
                            fill: '#6366F1',
                            stroke: '#DDD6FE',
                            strokeWidth: 1.8,
                            outline: 'none',
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* 툴팁 */}
          {tooltip && (
            <div
              className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-3"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y - 12}px`,
              }}
            >
              <div className="bg-slate-900/95 border border-violet-400/50 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-2xl text-center text-xs flex flex-col items-center gap-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                  <span className="text-sm">{tooltip.country.flag}</span>
                  <span>{tooltip.country.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-violet-300 font-medium">
                  <span>🎈 떠있는 소원:</span>
                  <span className="font-bold text-amber-300">{tooltip.wishCount}개</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 하단 푸터 / 안내 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-slate-500 py-2 flex items-center justify-center gap-2"
      >
        <Globe size={14} className="text-slate-600" />
        <span>지도의 나라를 클릭하면 해당 국가 상공의 소원들을 만날 수 있습니다.</span>
      </motion.footer>
    </div>
  );
}

