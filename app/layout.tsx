import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seoul Expat Cafes — Curated Work, Solo & Brunch Spots',
  description:
    'Human-curated cafe recommendations for Seoul expats, remote workers, and residents. Filter by quiet spaces, power outlets, English menus, and kid-free zones.',
  keywords: [
    'Seoul Expat Cafes',
    'Seoul Cafe Work',
    'Seongsu Cafes',
    'Yeonnam Cafes',
    'Itaewon Expat Cafes',
    'Seoul Remote Work Cafe',
    'Seoul Quiet Cafe',
  ],
  openGraph: {
    title: 'Seoul Expat Cafes — Human-Curated Local Guide',
    description: 'Find quiet cafes, laptop-friendly spots, and English-friendly brunch cafes in Seoul.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-stone-950 text-stone-100 flex flex-col antialiased selection:bg-amber-400 selection:text-stone-950">
        <main className="flex-1">{children}</main>

        <footer className="mt-16 border-t border-stone-850 bg-stone-950 py-10 px-6 text-center text-xs text-stone-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-stone-300">SEOUL EXPAT CAFES</span>
              <span>•</span>
              <span>Human-Curated Gazetteer</span>
            </div>
            <p className="text-stone-400">
              Not AI-generated. Personally tested & verified by local curators.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
