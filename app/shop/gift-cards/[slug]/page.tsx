// app/shop/gift-card/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import MenuOne from '@/components/Header/Menu/MenuOne';
import Footer from '@/components/layout/footer';
import ProductDetail from '@/components/Product/ProductDetail';
import { getProduct } from '@/lib/shopify-service';
import { getCollectionProductsDetailed, transformShopifyProductDetailed } from '@/lib/shopify-collections';
import type { ProductType } from '@/type/ProductType';

interface PageProps {
    params: { slug: string };
}

export async function generateStaticParams() {
    try {
        // adjust collection handle & limit as needed
        const products = await getCollectionProductsDetailed('gift-cards', 250);

        return (products || [])
            .map(p => p.handle)
            .filter(Boolean)
            .map(handle => ({ slug: String(handle) }));
    } catch (err) {
        console.error('generateStaticParams error:', err);
        // return empty array if fetching fails (prevents build crash)
        return [];
    }
}

export default async function GiftCardPage({ params }: PageProps) {
    const { slug } = params;

    try {
        const collectionProducts = await getCollectionProductsDetailed('gift-cards', 250);
        const shopifyProduct = collectionProducts.find(p => p.handle === slug);

        if (!shopifyProduct) {
            return notFound();
        }

        const product: ProductType = transformShopifyProductDetailed(shopifyProduct);

        return (
            <>
                <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
                <div id="header" className="relative w-full">
                    <MenuOne props="bg-transparent" />
                </div>

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
