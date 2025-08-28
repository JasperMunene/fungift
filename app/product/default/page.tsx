// app/shop/gifts/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import MenuOne from '@/components/Header/Menu/MenuOne';
import Footer from '@/components/layout/footer';
import ProductDetail from '@/components/Product/ProductDetail'; // client component
import { getProduct } from '@/lib/shopify-service';
import { transformShopifyProductDetailed } from '@/lib/shopify-collections';
import type { ProductType } from '@/type/ProductType';

interface PageProps {
    params: { slug: string };
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = params;

    try {
        // server call to fetch product by handle
        const res = await getProduct(slug);

        // Check if res exists and has the expected structure
        if (!res || !res.product) {
            console.error('Product not found or invalid response structure:', res);
            return notFound();
        }

        // get product from returned shape (shopify-service returns the data shape)
        const shopifyProduct = res.product;

        // transform for your frontend product type
        const product: ProductType = transformShopifyProductDetailed(shopifyProduct);

        // Additional validation to ensure product has required fields
        if (!product || !product.id || !product.name) {
            console.error('Transformed product is invalid:', product);
            return notFound();
        }

        return (
            <>
                <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
                <div id="header" className="relative w-full">
                    <MenuOne props="bg-transparent" />
                </div>

                {/* pass both transformed product and raw shopify product (for variant ids) */}
                <main className="container my-12">
                    <ProductDetail product={product} shopifyProduct={shopifyProduct} />
                </main>

                <Footer />
            </>
        );
    } catch (err) {
        console.error('Error loading product page:', err);
        return notFound();
    }
}
