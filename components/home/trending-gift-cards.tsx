'use client'

import React, { useState, useEffect } from 'react'
import { Suspense } from "react"
import GiftCard from '../Product/GiftCard'
import { ProductType } from '@/type/ProductType'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { getCollectionProducts, transformShopifyProduct } from '@/lib/shopify-collections';
import 'swiper/css/bundle';

interface Props {
  collectionHandle?: string; // Shopify collection handle, defaults to 'best-sellers'
  start?: number;
  limit?: number;
  category?: string; // Optiaonal category filter
}

const TrendingGiftCards: React.FC<Props> = ({
                                       collectionHandle = 'gift-cards',
                                       start = 0,
                                       limit = 8,
                                       category
                                     }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const shopifyProducts = await getCollectionProducts(collectionHandle, limit * 2);
        const transformedProducts = shopifyProducts.map(transformShopifyProduct);
        setProducts(transformedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching best sellers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, [collectionHandle, limit]);

  // Filter products by category if specified
  const filteredProducts = category
      ? products.filter(product => product.category === category)
      : products;

  const displayProducts = filteredProducts.slice(start, limit);

  if (loading) {
    return (
        <div className="tab-features-block md:pt-20 pt-10">
          <div className="container">
            <div className="heading3 text-center">Trending</div>
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Loading trending gift cards...</div>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="tab-features-block md:pt-20 pt-10">
          <div className="container">
            <div className="heading3 text-center">Best sellers</div>
            <div className="flex justify-center items-center h-64">
              <div className="text-red-500">Error loading products: {error}</div>
            </div>
          </div>
        </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
        <div className="tab-features-block md:pt-20 pt-10">
          <div className="container">
            <div className="heading3 text-center">Best sellers</div>
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">No products found in this collection</div>
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
};

export default TrendingGiftCards;