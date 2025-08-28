'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '../../lib/shopify-service';
import type { ShopifyProduct } from '@/type/shopify';

interface ProductsPageProps {}

const ProductsPage: React.FC<ProductsPageProps> = () => {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            try {
                const response = await getProducts(20);
                setProducts(response.products.edges.map(edge => edge.node));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

interface ProductCardProps {
    product: ShopifyProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const firstImage = product.images.edges[0]?.node;
    const firstVariant = product.variants.edges[0]?.node;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {firstImage && (
                <div className="relative h-48">
                    <Image
                        src={firstImage.url}
                        alt={firstImage.altText || product.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {product.description}
                </p>
                {firstVariant && (
                    <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-green-600">
              ${parseFloat(firstVariant.price.amount).toFixed(2)} {firstVariant.price.currencyCode}
            </span>
                        <Link
                            href={`/product/default/${product.handle}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            View Details
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;