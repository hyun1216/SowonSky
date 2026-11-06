import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '소원하늘 (SowonSky) - 밤하늘로 띄우는 우리들의 소원',
  description: '전 세계의 밤하늘을 올려다보고 마음속 소망을 풍선에 담아 띄워보세요.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-violet-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

