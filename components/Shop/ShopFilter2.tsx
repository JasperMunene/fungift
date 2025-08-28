// components/Shop/ShopFilter.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from '@/type/ProductType'
import Product2 from '../Product/Product2';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import HandlePagination from '../Other/HandlePagination';
import { getCollectionProductsDetailed, transformShopifyProductDetailed } from '@/lib/shopify-collections';

interface Props {
    collectionHandle?: string;
    productPerPage?: number;
    dataType?: string | null;
    pageTitle?: string;
}

// Add missing getColorCode function
const getColorCode = (colorName: string): string => {
    const colorMap: Record<string, string> = {
        'red': '#ff0000',
        'blue': '#0000ff',
        'green': '#00ff00',
        'yellow': '#ffff00',
        'black': '#000000',
        'white': '#ffffff',
        'purple': '#800080',
        'orange': '#ffa500',
        'pink': '#ffc0cb',
        'brown': '#a52a2a',
        'gray': '#808080',
    };

    return colorMap[(colorName || '').toLowerCase()] || '#cccccc';
};

const ShopFilter: React.FC<Props> = ({
                                         collectionHandle = 'gifts',
                                         productPerPage = 12,
                                         dataType = null,
                                         pageTitle = 'Gifts'
                                     }) => {
    // State management
    const [data, setData] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [layoutCol, setLayoutCol] = useState<number>(4);
    const [showOnlySale, setShowOnlySale] = useState(false);
    const [sortOption, setSortOption] = useState('');
    const [openSidebar, setOpenSidebar] = useState(false);
    const [type, setType] = useState<string | null>(dataType);
    const [size, setSize] = useState<string | null>();
    const [color, setColor] = useState<string | null>();
    const [brand, setBrand] = useState<string | null>();
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 200 });
    const [currentPage, setCurrentPage] = useState(0);

    const productsPerPage = productPerPage || 12; // ensure number
    const offset = currentPage * productsPerPage;

    // Fetch products from Shopify
    useEffect(() => {
        let mounted = true;
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const shopifyProducts = await getCollectionProductsDetailed(collectionHandle, 100);
                const transformedProducts = (shopifyProducts || []).map(transformShopifyProductDetailed);
                if (!mounted) return;
                setData(transformedProducts);

                // Set dynamic price range based on actual product prices
                if (transformedProducts.length > 0) {
                    const prices = transformedProducts.map(p => p.price || 0);
                    const maxPrice = Math.ceil(Math.max(...prices));
                    const minPrice = Math.floor(Math.min(...prices));
                    setPriceRange({ min: Math.max(0, minPrice), max: maxPrice });
                }
            } catch (err) {
                if (!mounted) return;
                setError(err instanceof Error ? err.message : 'Failed to fetch products');
                console.error('Error fetching products:', err);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        fetchProducts();
        return () => { mounted = false; };
    }, [collectionHandle]);

    // Memoize unique values from fetched data for filters
    const uniqueTypes = useMemo(() => [...new Set(data.map(product => product.type || '').filter(Boolean))], [data]);
    const uniqueBrands = useMemo(() => [...new Set(data.map(product => product.brand || '').filter(b => b && b !== 'Unknown'))], [data]);
    const uniqueColors = useMemo(() => [
        ...new Set(
            data.flatMap(product => (product.variation || []).map(v => (v && v.color) ? v.color.toString() : ''))
        ).values()
    ].filter(Boolean), [data]);

    // Handler functions
    const handleLayoutCol = (col: number) => {
        setLayoutCol(col);
    };

    const handleShowOnlySale = () => {
        setShowOnlySale(toggleSelect => !toggleSelect);
        setCurrentPage(0);
    };

    const handleSortChange = (option: string) => {
        setSortOption(option);
        setCurrentPage(0);
    };

    const handleOpenSidebar = () => {
        setOpenSidebar(toggleOpen => !toggleOpen);
    };

    const handleType = (selectedType: string) => {
        setType((prevType) => (prevType === selectedType ? null : selectedType));
        setCurrentPage(0);
    };

    const handleSize = (selectedSize: string) => {
        setSize((prevSize) => (prevSize === selectedSize ? null : selectedSize));
        setCurrentPage(0);
    };

    const handlePriceChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            setPriceRange({ min: values[0], max: values[1] });
            setCurrentPage(0);
        }
    };

    const handleColor = (selectedColor: string) => {
        setColor((prevColor) => (prevColor === selectedColor ? null : selectedColor));
        setCurrentPage(0);
    };

    const handleBrand = (selectedBrand: string) => {
        setBrand((prevBrand) => (prevBrand === selectedBrand ? null : selectedBrand));
        setCurrentPage(0);
    };

    // Filter logic
    let filteredData = data.filter(product => {
        let isShowOnlySaleMatched = true;
        if (showOnlySale) {
            isShowOnlySaleMatched = !!product.sale;
        }

        let isDataTypeMatched = true;
        if (dataType) {
            isDataTypeMatched = product.type === dataType;
        }

        let isTypeMatched = true;
        if (type) {
            isTypeMatched = product.type === type;
        }

        let isSizeMatched = true;
        if (size) {
            isSizeMatched = (product.sizes || []).includes(size);
        }

        let isPriceRangeMatched = true;
        isPriceRangeMatched = (product.price || 0) >= priceRange.min && (product.price || 0) <= priceRange.max;

        let isColorMatched = true;
        if (color) {
            isColorMatched = (product.variation || []).some(item => item.color === color);
        }

        let isBrandMatched = true;
        if (brand) {
            isBrandMatched = product.brand === brand;
        }

        return isShowOnlySaleMatched && isDataTypeMatched && isTypeMatched &&
            isSizeMatched && isColorMatched && isBrandMatched && isPriceRangeMatched;
    });

    // Sorting logic (create a shallow copy to avoid mutating state by accident)
    if (sortOption === 'soldQuantityHighToLow') {
        filteredData = [...filteredData].sort((a, b) => (b.sold || 0) - (a.sold || 0));
    } else if (sortOption === 'discountHighToLow') {
        filteredData = [...filteredData].sort((a, b) => {
            const aDiscount = a.originPrice ? Math.floor(100 - ((a.price / a.originPrice) * 100)) : 0;
            const bDiscount = b.originPrice ? Math.floor(100 - ((b.price / b.originPrice) * 100)) : 0;
            return bDiscount - aDiscount;
        });
    } else if (sortOption === 'priceHighToLow') {
        filteredData = [...filteredData].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === 'priceLowToHigh') {
        filteredData = [...filteredData].sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    const totalProducts = filteredData.length;
    const selectedType = type;
    const selectedSize = size;
    const selectedColor = color;
    const selectedBrand = brand;

    // Pagination
    const pageCount = Math.max(1, Math.ceil(filteredData.length / productsPerPage));
    const currentProducts: ProductType[] = filteredData.slice(offset, offset + productsPerPage);

    const handlePageChange = (selected: number) => {
        setCurrentPage(selected);
    };

    const handleClearAll = () => {
        setType(null);
        setSize(null);
        setColor(null);
        setBrand(null);
        if (data.length > 0) {
            const maxPrice = Math.max(...data.map(p => p.price || 0));
            setPriceRange({ min: 0, max: maxPrice });
        }
        setCurrentPage(0);
    };

    // Get layout class based on selected column count
    const getGridClass = () => {
        switch(layoutCol) {
            case 3: return "lg:grid-cols-3";
            case 4: return "lg:grid-cols-4";
            case 5: return "lg:grid-cols-5";
            default: return "lg:grid-cols-4";
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading products...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-500">Error: {error}</div>
                        <button
                            onClick={() => window.location.reload()}
                            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">{pageTitle}</div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link href={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize'>{pageTitle}</div>
                                </div>
                            </div>
                            <div className="list-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 lg:mt-[70px] mt-12 overflow-hidden">
                                {uniqueTypes.slice(0, 5).map((item, index) => (
                                    <div
                                        key={index}
                                        className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${type === item ? 'active' : ''}`}
                                        onClick={() => handleType(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="list-product-block relative">
                        <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
                            <div className="left flex has-line items-center flex-wrap gap-5">
                                <div
                                    className="filter-sidebar-btn flex items-center gap-2 cursor-pointer"
                                    onClick={handleOpenSidebar}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 21V14" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4 10V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 21V12" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 8V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 21V16" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 12V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 14H7" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 8H15" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17 16H23" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Filters</span>
                                </div>
                                <div className="choose-layout flex items-center gap-2">
                                    {[3, 4, 5].map(col => (
                                        <div
                                            key={col}
                                            className={`item p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === col ? 'active' : ''}`}
                                            onClick={() => handleLayoutCol(col)}
                                        >
                                            <div className='flex items-center gap-0.5'>
                                                {Array(col).fill(0).map((_, i) => (
                                                    <span key={i} className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="check-sale flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="filterSale"
                                        id="filter-sale"
                                        className='border-line'
                                        onChange={handleShowOnlySale}
                                        checked={showOnlySale}
                                    />
                                    <label htmlFor="filter-sale" className='caption1 cursor-pointer'>Show only products on sale</label>
                                </div>
                            </div>
                            <div className="right flex items-center gap-3">
                                <label htmlFor='select-filter' className="caption1 capitalize">Sort by</label>
                                <div className="select-block relative">
                                    <select
                                        id="select-filter"
                                        name="select-filter"
                                        className='caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line'
                                        onChange={(e) => { handleSortChange(e.target.value) }}
                                        value={sortOption}
                                    >
                                        <option value="">Sorting</option>
                                        <option value="soldQuantityHighToLow">Best Selling</option>
                                        <option value="discountHighToLow">Best Discount</option>
                                        <option value="priceHighToLow">Price High To Low</option>
                                        <option value="priceLowToHigh">Price Low To High</option>
                                    </select>
                                    <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-4 right-2' />
                                </div>
                            </div>
                        </div>

                        <div
                            className={`sidebar style-dropdown bg-white grid md:grid-cols-4 grid-cols-2 md:gap-[30px] gap-6 ${openSidebar ? 'open' : ''}`}
                        >
                            <div className="filter-type">
                                <div className="heading6">Products Type</div>
                                <div className="list-type mt-4">
                                    {uniqueTypes.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`item flex items-center justify-between cursor-pointer ${type === item ? 'active' : ''}`}
                                            onClick={() => handleType(item)}
                                        >
                                            <div className='text-secondary has-line-before hover:text-black capitalize'>{item}</div>
                                            <div className='text-secondary2'>
                                                ({data.filter(dataItem => dataItem.type === item).length})
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="filter-size">
                                    <div className="heading6">Size</div>
                                    <div className="list-size flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                                        {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((item, index) => (
                                            <div
                                                key={index}
                                                className={`size-item text-button w-[44px] h-[44px] flex items-center justify-center rounded-full border border-line ${size === item ? 'active' : ''}`}
                                                onClick={() => handleSize(item)}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                        <div
                                            className={`size-item text-button px-4 py-2 flex items-center justify-center rounded-full border border-line ${size === 'freesize' ? 'active' : ''}`}
                                            onClick={() => handleSize('freesize')}
                                        >
                                            Freesize
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-price mt-8">
                                    <div className="heading6">Price Range</div>
                                    <Slider
                                        range
                                        value={[priceRange.min, priceRange.max]}
                                        min={0}
                                        max={priceRange.max}
                                        onChange={handlePriceChange}
                                        className='mt-5'
                                    />
                                    <div className="price-block flex items-center justify-between flex-wrap mt-4">
                                        <div className="min flex items-center gap-1">
                                            <div>Min price:</div>
                                            <div className='price-min'>$<span>{priceRange.min}</span></div>
                                        </div>
                                        <div className="max flex items-center gap-1">
                                            <div>Max price:</div>
                                            <div className='price-max'>$<span>{priceRange.max}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="filter-color">
                                <div className="heading6">Colors</div>
                                <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                                    {uniqueColors.slice(0, 8).map((colorItem, index) => (
                                        <div
                                            key={index}
                                            className={`color-item px-3 py-[5px] flex items-center justify-center gap-2 rounded-full border border-line ${color === colorItem ? 'active' : ''}`}
                                            onClick={() => handleColor(colorItem)}
                                        >
                                            <div
                                                className="color w-5 h-5 rounded-full"
                                                style={{ backgroundColor: getColorCode(colorItem) }}
                                            ></div>
                                            <div className="caption1 capitalize">{colorItem}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="filter-brand">
                                <div className="heading6">Brands</div>
                                <div className="list-brand mt-4">
                                    {uniqueBrands.slice(0, 6).map((item, index) => (
                                        <div key={index} className="brand-item flex items-center justify-between">
                                            <div className="left flex items-center cursor-pointer">
                                                <div className="block-input">
                                                    <input
                                                        type="checkbox"
                                                        name={item}
                                                        id={item}
                                                        checked={brand === item}
                                                        onChange={() => handleBrand(item)}
                                                        className="hidden"
                                                    />
                                                    <Icon.CheckSquare
                                                        size={20}
                                                        weight={brand === item ? 'fill' : 'regular'}
                                                        className='icon-checkbox'
                                                    />
                                                </div>
                                                <label htmlFor={item} className="brand-name capitalize pl-2 cursor-pointer">{item}</label>
                                            </div>
                                            <div className='text-secondary2'>
                                                ({data.filter(dataItem => dataItem.brand === item).length})
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="list-filtered flex items-center gap-3 mt-4">
                            <div className="total-product">
                                {totalProducts}
                                <span className='text-secondary pl-1'>Products Found</span>
                            </div>
                            {(selectedType || selectedSize || selectedColor || selectedBrand) && (
                                <>
                                    <div className="list flex items-center gap-3">
                                        <div className='w-px h-4 bg-line'></div>
                                        {selectedType && (
                                            <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize" onClick={() => { setType(null) }}>
                                                <Icon.X className='cursor-pointer' size={14} />
                                                <span>{selectedType}</span>
                                            </div>
                                        )}
                                        {selectedSize && (
                                            <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize" onClick={() => { setSize(null) }}>
                                                <Icon.X className='cursor-pointer' size={14} />
                                                <span>{selectedSize}</span>
                                            </div>
                                        )}
                                        {selectedColor && (
                                            <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize" onClick={() => { setColor(null) }}>
                                                <Icon.X className='cursor-pointer' size={14} />
                                                <span>{selectedColor}</span>
                                            </div>
                                        )}
                                        {selectedBrand && (
                                            <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize" onClick={() => { setBrand(null) }}>
                                                <Icon.X className='cursor-pointer' size={14} />
                                                <span>{selectedBrand}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                                        onClick={handleClearAll}
                                    >
                                        <Icon.X color='rgb(219, 68, 68)' className='cursor-pointer' size={14} />
                                        <span className='text-button-uppercase text-red'>Clear All</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className={`list-product hide-product-sold grid ${getGridClass()} sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7`}>
                            {currentProducts.length === 0 ? (
                                <div className="col-span-full text-center py-10">
                                    <div className="text-lg text-gray-500">No products match the selected criteria.</div>
                                    <button
                                        onClick={handleClearAll}
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                currentProducts.map((item) => (
                                    <Link key={item.id} href={`/shop/gift-cards/${encodeURIComponent(item.slug || item.id)}`}>
                                        <Product2 data={item} type='grid' style='style-1' />
                                    </Link>
                                ))
                            )}
                        </div>

                        {pageCount > 1 && (
                            <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
                                <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopFilter;
