'use client'

import React, { useState, useEffect } from 'react'
import Product from '../Product/Product'
import { ProductType } from '@/type/ProductType'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { getCollectionProducts, transformShopifyProduct, getCollectionDetails } from '@/lib/shopify-collections';
import 'swiper/css/bundle';

interface Props {
    collectionHandle?: string; // Shopify collection handle, defaults to 'best-sellers'
    start?: number;
    limit?: number;
    category?: string; // Optional category filter
}

const BestSeller: React.FC<Props> = ({
                                         collectionHandle = 'best-sellers',
                                         start = 0,
                                         limit = 8,
                                         category
                                     }) => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [collectionTitle, setCollectionTitle] = useState<string>('Best sellers');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch collection details first to get the title
                const collectionDetails = await getCollectionDetails(collectionHandle);
                if (collectionDetails) {
                    setCollectionTitle(collectionDetails.title || 'Best sellers');
                }

                // Fetch products with a higher limit if we need to filter by category
                const fetchLimit = category ? limit * 3 : limit;
                const shopifyProducts = await getCollectionProducts(collectionHandle, fetchLimit);

                // Transform products
                const transformedProducts = shopifyProducts.map(transformShopifyProduct);

                // Filter by category if specified
                const filteredProducts = category
                    ? transformedProducts.filter(product => product.category === category)
                    : transformedProducts;

                // Apply start and limit after filtering
                const finalProducts = filteredProducts.slice(start, start + limit);

                setProducts(finalProducts);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch products');
                console.error('Error fetching best sellers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, [collectionHandle, limit, start, category]);

    if (loading) {
        return (
            <div className="tab-features-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading3 text-center">{collectionTitle}</div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading products...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tab-features-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading3 text-center">{collectionTitle}</div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-500">Error loading products: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="tab-features-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading3 text-center">{collectionTitle}</div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">
                            {category
                                ? `No ${category} products found in this collection`
                                : 'No products found in this collection'
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tab-features-block section-padding">
            <div className="container">
                <div className="heading3 text-center mb-8">{collectionTitle}</div>
                <div className="list-product hide-product-sold section-swiper-navigation style-outline style-small-border">
                    <Swiper
                        spaceBetween={12}
                        slidesPerView={2}
                        navigation
                        loop={products.length > 4}
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
                        {products.map((product, index) => (
                            <SwiperSlide key={product.id || index}>
                                <Product data={product} type='grid' style='style-1' />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default BestSeller;