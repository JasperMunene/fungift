// app/shop/gifts/[slug]/page.tsx
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
        const products = await getCollectionProductsDetailed('gifts', 250);
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

export default async function ProductPage({ params }: PageProps) {
    const { slug } = params;

    try {
        const res = await getProduct(slug); // expects handle
        const shopifyProduct = (res as any)?.product;

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
                    <div className="product-detail-page rounded-2xl pt-10 bg-white p-6 border border-line">
                        <ProductDetail product={product} shopifyProduct={shopifyProduct} />
                    </div>
                </main>

                <Footer />
            </>
        );
    } catch (err) {
        console.error('Error loading product page:', err);
        return notFound();
    }
}