import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import Footer from '@/components/layout/footer';
import  TrendingGiftCards  from '@/components/home/trending-gift-cards';
import Benefit from '@/components/Benefit/Benefit'
import Slider from '@/components/Slider/Slider'
import BestSeller from '@/components/BestSeller/BestSeller'
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import MenuOne from "@/components/Header/Menu/MenuOne";
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
          <BestSeller collectionHandle="best-sellers" limit={8} />
        <TrendingGiftCards collectionHandle='gift-cards' limit={8} />
        {/*<Features />*/}
          <WhyChooseUs />
          <Footer />
      </>
  );
}