import React from 'react'
import Product from '../Product/Product'
import { ProductType } from '@/type/ProductType'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { getCollectionProducts, transformShopifyProduct, getCollectionDetails } from '@/lib/shopify-collections';
import 'swiper/css/bundle';

interface Props {
    collectionHandle?: string;
    start?: number;
    limit?: number;
    category?: string;
}

const BestSellerAsync: React.FC<Props> = async ({
    collectionHandle = 'best-sellers',
    start = 0,
    limit = 8,
    category
}) => {
    try {
        // Fetch collection details first to get the title
        const collectionDetails = await getCollectionDetails(collectionHandle);
        const collectionTitle = collectionDetails?.title || 'Best sellers';

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

        if (finalProducts.length === 0) {
            return (
                <div className="tab-features-block section-padding">
                    <div className="container">
                        <div className="heading3 text-center mb-8">{collectionTitle}</div>
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
                            loop={finalProducts.length > 4}
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
                            {finalProducts.map((product, index) => (
                                <SwiperSlide key={product.id || index}>
                                    <Product data={product} type='grid' style='style-1' />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching best sellers:', error);
        return (
            <div className="tab-features-block section-padding">
                <div className="container">
                    <div className="heading3 text-center mb-8">Best sellers</div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-500">Error loading products. Please try again later.</div>
                    </div>
                </div>
            </div>
        );
    }
};

export default BestSellerAsync;
