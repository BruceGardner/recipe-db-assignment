import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
 
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});
 
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
 
export const metadata: Metadata = {
  title: { default: 'RecipeBox', template: '%s | RecipeBox' },
  description: 'Save and organize your favorite recipes.',
};
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-amber-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
 
