import './globals.css';
import '@/styles/styles.scss'
import GlobalProvider from './GlobalProvider'
import ModalCart from '@/components/Modal/ModalCart'
import ModalWishlist from '@/components/Modal/ModalWishlist'
import ModalQuickview from '@/components/Modal/ModalQuickview'
import ModalCompare from '@/components/Modal/ModalCompare'
import ModalGiftCardQuickview from '@/components/Modal/ModalGiftCardQuickview'
import ModalSearch from '@/components/Modal/ModalSearch'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import PerformanceProvider from '@/components/providers/performance-provider';
import CountdownTimeType from '@/type/CountdownType'
import { countdownTime } from '@/store/countdownTime'

const serverTimeLeft: CountdownTimeType = countdownTime();

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fungift - Premium Gift Cards & Unique Gifts',
  description: 'Discover the perfect gifts and digital gift cards for every occasion. Premium quality products with fast, secure delivery.',
  keywords: 'gift cards, gifts, presents, digital gifts, physical gifts, occasions, birthdays, holidays',
  openGraph: {
    title: 'Fungift - Premium Gift Cards & Unique Gifts',
    description: 'Discover the perfect gifts and digital gift cards for every occasion.',
    type: 'website',
    locale: 'en_US',
  },
  other: {
    'theme-color': '#D2EF9A',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <GlobalProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PerformanceProvider>
          <Providers>
            {children}
            <ModalCart serverTimeLeft={serverTimeLeft} />
            <ModalWishlist />
            <ModalSearch />
            <ModalQuickview />
            <ModalCompare />
            <ModalGiftCardQuickview />
            <Toaster />
          </Providers>
        </PerformanceProvider>
      </body>
    </html>
      </GlobalProvider>
  );
}