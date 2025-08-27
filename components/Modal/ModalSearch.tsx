'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Product from '../Product/Product';
import { useModalSearchContext } from '@/context/ModalSearchContext'
import { ProductType } from '@/type/ProductType'
import { searchProducts, transformSearchProduct } from '@/lib/shopify-search'

const ModalSearch = () => {
    const { isModalOpen, closeModalSearch } = useModalSearchContext();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recentlyViewed, setRecentlyViewed] = useState<ProductType[]>([]);
    const router = useRouter();

    // Fetch recently viewed products from localStorage
    useEffect(() => {
        const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
        if (storedRecentlyViewed) {
            try {
                setRecentlyViewed(JSON.parse(storedRecentlyViewed));
            } catch (err) {
                console.error('Error parsing recently viewed products:', err);
            }
        }
    }, [isModalOpen]);

    // Debounced search function
    const debouncedSearch = useCallback(
        (value: string) => {
            if (value.trim() === '') {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            setError(null);

            searchProducts(value, 8)
                .then(shopifyProducts => {
                    const transformedProducts = shopifyProducts.map(transformSearchProduct);
                    setSearchResults(transformedProducts);
                })
                .catch(err => {
                    setError(err instanceof Error ? err.message : 'Failed to search products');
                    console.error('Error searching products:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        []
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            debouncedSearch(searchKeyword);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchKeyword, debouncedSearch]);

    const handleSearch = (value: string) => {
        if (value.trim()) {
            // Store search in localStorage for recent searches
            const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
            const updatedSearches = [value, ...recentSearches.filter((s: string) => s !== value)].slice(0, 5);
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

            router.push(`/search-result?query=${encodeURIComponent(value)}`);
            closeModalSearch();
            setSearchKeyword('');
        }
    };

    const popularKeywords = ['dress', 't-shirt', 'underwear', 'top', 'jeans', 'jacket', 'skirt', 'shoes'];

    return (
        <>
            <div
                className={`modal-search-block fixed inset-0 bg-black/70 z-50 transition-opacity duration-300 ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={closeModalSearch}
            >
                <div
                    className={`modal-search-main bg-white md:p-10 p-6 rounded-[32px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[80vh] overflow-y-auto transition-all duration-300 ${isModalOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="form-search relative">
                        <Icon.X
                            className='absolute left-6 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black'
                            size={20}
                            onClick={closeModalSearch}
                        />
                        <input
                            type="text"
                            placeholder='Search products...'
                            className='text-button-lg h-14 rounded-2xl border border-line w-full pl-14 pr-12 focus:border-black focus:outline-none transition-colors'
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                            autoFocus
                        />
                        <Icon.MagnifyingGlass
                            className='absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer'
                            size={20}
                            onClick={() => handleSearch(searchKeyword)}
                        />
                    </div>

                    {searchKeyword ? (
                        <div className="search-results mt-8">
                            <div className="heading5 mb-4">
                                {loading ? 'Searching...' : `Search Results for "${searchKeyword}"`}
                            </div>
                            {error && (
                                <div className="text-red-500 mb-4">{error}</div>
                            )}
                            {!loading && searchResults.length === 0 ? (
                                <div className="text-gray-500 text-center py-8">
                                    No products found for "{searchKeyword}"
                                </div>
                            ) : (
                                <div className="list-product hide-product-sold grid xl:grid-cols-4 sm:grid-cols-2 gap-7">
                                    {searchResults.map((product) => (
                                        <Product
                                            key={product.id}
                                            data={product}
                                            type='grid'
                                            style='style-1'
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="keyword mt-8">
                                <div className="heading5">Popular Searches</div>
                                <div className="list-keyword flex items-center flex-wrap gap-3 mt-4">
                                    {popularKeywords.map((keyword, index) => (
                                        <div
                                            key={index}
                                            className="item px-4 py-1.5 border border-line rounded-full cursor-pointer duration-300 hover:bg-black hover:text-white"
                                            onClick={() => {
                                                setSearchKeyword(keyword);
                                                handleSearch(keyword);
                                            }}
                                        >
                                            {keyword}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="list-recent mt-8">
                                <div className="heading5">Recently Viewed Products</div>
                                {recentlyViewed.length > 0 ? (
                                    <div className="list-product pb-5 hide-product-sold grid xl:grid-cols-4 sm:grid-cols-2 gap-7 mt-4">
                                        {recentlyViewed.slice(0, 4).map((product) => (
                                            <Product
                                                key={product.id}
                                                data={product}
                                                type='grid'
                                                style='style-1'
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 mt-4">
                                        No recently viewed products
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default ModalSearch;