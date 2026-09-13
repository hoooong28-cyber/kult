import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEOUL EXPAT CAFES — Human-Curated Gazette & Local Guide',
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
    title: 'SEOUL EXPAT CAFES — Human-Curated Local Guide',
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#fcf9f5] text-[#1c1c1a] flex flex-col antialiased selection:bg-[#1c1c1a] selection:text-[#fcf9f5]">
        <main className="flex-1">{children}</main>

        <footer className="mt-16 border-t border-[#e2dec] bg-[#f4efe6] py-10 px-6 text-center text-xs text-[#5e5e5d]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#1c1c1a] tracking-tight">SEOUL EXPAT CAFES</span>
              <span>•</span>
              <span className="font-mono text-[#747878] uppercase">Human-Curated Gazette</span>
            </div>
            <p className="text-[#5e5e5d]">
              Not AI-generated. Personally tested & verified by local Seoul curators.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
