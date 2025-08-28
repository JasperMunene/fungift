import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import Benefit from '@/components/Benefit/Benefit'
import Slider from '@/components/Slider/Slider'
import MenuOne from "@/components/Header/Menu/MenuOne";
import AsyncSections from '@/components/home/async-sections';
import { LazyWhyChooseUs, LazyFooter } from '@/components/ui/lazy-components';
import React from "react";

export default function Home() {
  return (
      <>
        <TopNavOne props="style-one bg-black" slogan='New customers save 10% with the code GET10' />

      <div id="header" className="relative w-full">
          <MenuOne props="bg-transparent" />
        {/*<BannerTop props="bg-black py-3" textColor='text-white' bgLine='bg-white' />*/}
        <Slider />
      </div>
        <Benefit props="md:py-20 py-10" />
        <AsyncSections 
          bestSellersProps={{ collectionHandle: "best-sellers", limit: 8 }}
          giftCardsProps={{ collectionHandle: 'gift-cards', limit: 8 }}
        />
        {/*<Features />*/}
          <LazyWhyChooseUs />
          <LazyFooter />
      </>
  );
}