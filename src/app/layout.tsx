import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sowonsky.vercel.app'),
  title: '소원하늘 (SowonSky) - 밤하늘로 띄우는 우리들의 소원',
  description: '전 세계의 밤하늘을 올려다보고 마음속 소망을 풍선에 담아 띄워보세요. 12시간 동안 밤하늘을 밝히는 따뜻한 소망의 공간.',
  applicationName: '소원하늘 (SowonSky)',
  keywords: ['소원하늘', 'SowonSky', '소원', '풍선', '밤하늘', '별빛', '익명소원', '감성웹'],
  authors: [{ name: 'devom' }],
  openGraph: {
    title: '소원하늘 (SowonSky) - 밤하늘로 띄우는 우리들의 소원',
    description: '전 세계의 밤하늘을 올려다보고 마음속 소망을 풍선에 담아 띄워보세요. 12시간 동안 밤하늘을 밝히는 따뜻한 소망의 공간.',
    url: 'https://sowonsky.vercel.app',
    siteName: '소원하늘 (SowonSky)',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '소원하늘 (SowonSky) - 밤하늘로 띄우는 소원 풍선',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '소원하늘 (SowonSky) - 밤하늘로 띄우는 우리들의 소원',
    description: '전 세계의 밤하늘을 올려다보고 마음속 소망을 풍선에 담아 띄워보세요.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/og-image.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <head>
        <meta property="og:image:type" content="image/png" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-violet-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
