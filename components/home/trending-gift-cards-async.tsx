import React from 'react'
import GiftCard from '../Product/GiftCard'
import { ProductType } from '@/type/ProductType'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { getCollectionProducts, transformShopifyProduct } from '@/lib/shopify-collections';
import 'swiper/css/bundle';

interface Props {
  collectionHandle?: string;
  start?: number;
  limit?: number;
  category?: string;
}

const TrendingGiftCardsAsync: React.FC<Props> = async ({
  collectionHandle = 'gift-cards',
  start = 0,
  limit = 8,
  category
}) => {
  try {
    const shopifyProducts = await getCollectionProducts(collectionHandle, limit * 2);
    const transformedProducts = shopifyProducts.map(transformShopifyProduct);

    // Filter products by category if specified
    const filteredProducts = category
      ? transformedProducts.filter(product => product.category === category)
      : transformedProducts;

    const displayProducts = filteredProducts.slice(start, limit);

    if (displayProducts.length === 0) {
      return (
        <div className="tab-features-block section-padding">
          <div className="container">
            <div className="heading3 text-center mb-8">Gift Cards</div>
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">No gift cards found in this collection</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="tab-features-block section-padding">
        <div className="container">
          <div className="heading3 text-center mb-8">Gift Cards</div>
          <div className="list-product hide-product-sold section-swiper-navigation style-outline style-small-border">
            <Swiper
              spaceBetween={12}
              slidesPerView={2}
              navigation
              loop={displayProducts.length > 4}
              modules={[Navigation, Autoplay]}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                576: {
                  slidesPerView: 2,
                  spaceBetween: 12,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                992: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              className='h-full'
            >
              {displayProducts.map((product, index) => (
                <SwiperSlide key={product.id || index}>
                  <GiftCard data={product} type='grid' style='style-1' />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return (
      <div className="tab-features-block section-padding">
        <div className="container">
          <div className="heading3 text-center mb-8">Gift Cards</div>
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Error loading gift cards. Please try again later.</div>
          </div>
        </div>
      </div>
    );
  }
};

export default TrendingGiftCardsAsync;
