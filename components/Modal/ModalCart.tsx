'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from '@/type/ProductType';
import { useModalCartContext } from '@/context/ModalCartContext'
import { useCart } from '@/context/CartContext'
import { countdownTime } from '@/store/countdownTime'
import CountdownTimeType from '@/type/CountdownType';

const ModalCart = ({ serverTimeLeft }: { serverTimeLeft: CountdownTimeType }) => {
    const [timeLeft, setTimeLeft] = useState(serverTimeLeft);
    const [recommendedProducts, setRecommendedProducts] = useState<ProductType[]>([]);
    const [recommendedLoading, setRecommendedLoading] = useState<boolean>(true);
    const [recommendedError, setRecommendedError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(countdownTime());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const [activeTab, setActiveTab] = useState<string | undefined>('')
    const { isModalOpen, closeModalCart } = useModalCartContext();
    const { cartState, addToCart, removeFromCart, updateCart } = useCart()

    // Fetch recommended products from Shopify
    const fetchRecommendedProducts = useCallback(async () => {
        try {
            setRecommendedLoading(true);
            setRecommendedError(null);

            // Use a more direct approach to fetch products from Shopify
            const query = `
                query getRecommendedProducts($first: Int!) {
                    products(first: $first, sortKey: BEST_SELLING) {
                        edges {
                            node {
                                id
                                title
                                handle
                                description
                                tags
                                priceRange {
                                    minVariantPrice {
                                        amount
                                        currencyCode
                                    }
                                }
                                compareAtPriceRange {
                                    minVariantPrice {
                                        amount
                                        currencyCode
                                    }
                                }
                                images(first: 5) {
                                    edges {
                                        node {
                                            url
                                            altText
                                        }
                                    }
                                }
                                variants(first: 1) {
                                    edges {
                                        node {
                                            id
                                            title
                                            availableForSale
                                        }
                                    }
                                }
                                availableForSale
                            }
                        }
                    }
                }
            `;

            const variables = { first: 6 };

            const response = await fetch(
                `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Storefront-Access-Token':
                            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
                    },
                    body: JSON.stringify({ query, variables }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch recommended products');
            }

            const result = await response.json();

            if (result.errors) {
                throw new Error(result.errors.map((e: any) => e.message).join(', '));
            }

            const products = result.data?.products?.edges || [];

            const transformedProducts: ProductType[] = products.map((edge: any) => {
                const product = edge.node;
                const price = parseFloat(product.priceRange.minVariantPrice.amount);
                const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
                    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
                    : null;

                return {
                    id: product.id,
                    name: product.title,
                    description: product.description || '',
                    price: Math.floor(price),
                    originPrice: compareAtPrice ? Math.floor(compareAtPrice) : Math.floor(price),
                    images: product.images.edges.map((img: any) => img.node.url),
                    category: 'recommended',
                    type: product.tags.includes('gift-card') ? 'gift-card' : 'product',
                    sizes: ['M'], // Default size
                    colors: ['default'],
                    quantityPurchase: 1,
                    variation: [],
                    thumbImage: product.images.edges[0]?.node.url || '',
                    tags: product.tags,
                    handle: product.handle,
                    availableForSale: product.availableForSale,
                    variantId: product.variants.edges[0]?.node.id || product.id,
                    new: false,
                    sale: compareAtPrice ? compareAtPrice > price : false,
                    rate: 5,
                    gender: 'unisex' as const,
                };
            }).filter((product: ProductType) => product.availableForSale);

            setRecommendedProducts(transformedProducts);
        } catch (err) {
            setRecommendedError(err instanceof Error ? err.message : 'Failed to fetch recommended products');
            console.error('Error fetching recommended products:', err);
        } finally {
            setRecommendedLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            fetchRecommendedProducts();
        }
    }, [isModalOpen, fetchRecommendedProducts]);

    const handleAddToCart = (productItem: ProductType) => {
        if (!cartState.cartArray.find(item => item.id === productItem.id)) {
            addToCart({ ...productItem });
            updateCart(productItem.id, productItem.quantityPurchase, '', '')
        } else {
            updateCart(productItem.id, productItem.quantityPurchase, '', '')
        }
    };

    const handleActiveTab = (tab: string) => {
        setActiveTab(tab)
    }

    let moneyForFreeship = 150;
    let [totalCart, setTotalCart] = useState<number>(0)
    let [discountCart, setDiscountCart] = useState<number>(0)

    cartState.cartArray.map(item => totalCart += item.price * item.quantity)

    // Updated checkout function to properly handle variant IDs
    const handleCheckout = async () => {
        if (cartState.cartArray.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setIsProcessing(true);
        try {
            // Process each cart item to get proper variant IDs
            const lineItemsPromises = cartState.cartArray.map(async (item) => {
                let variantId = item.variantId;

                // If we don't have a proper variant ID, fetch it from Shopify
                if (!variantId || !variantId.includes('gid://shopify/ProductVariant/')) {
                    try {
                        console.log(`Fetching variants for item: ${item.name} (${item.id})`);

                        const variantsResponse = await fetch(`/api/get-variants?productId=${encodeURIComponent(item.id)}`);

                        if (variantsResponse.ok) {
                            const variantsData = await variantsResponse.json();
                            const variants = variantsData.variants;

                            if (variants && variants.length > 0) {
                                // Find matching variant based on selected options or use first available
                                let selectedVariant = variants[0];

                                // Try to match selected size and color
                                if ((item.selectedSize || item.selectedColor) && variants.length > 1) {
                                    const matchingVariant = variants.find((variant: any) => {
                                        const options = variant.selectedOptions;

                                        const sizeMatch = !item.selectedSize || options.some((opt: any) =>
                                            opt.name.toLowerCase().includes('size') &&
                                            opt.value.toLowerCase() === item.selectedSize?.toLowerCase()
                                        );

                                        const colorMatch = !item.selectedColor || options.some((opt: any) =>
                                            opt.name.toLowerCase().includes('color') &&
                                            opt.value.toLowerCase() === item.selectedColor?.toLowerCase()
                                        );

                                        return sizeMatch && colorMatch && variant.availableForSale;
                                    });

                                    if (matchingVariant) {
                                        selectedVariant = matchingVariant;
                                    }
                                }

                                variantId = selectedVariant.id;
                                console.log(`Found variant ID for ${item.name}: ${variantId}`);
                            } else {
                                throw new Error(`No variants found for ${item.name}`);
                            }
                        } else {
                            throw new Error(`Failed to fetch variants for ${item.name}`);
                        }
                    } catch (variantError) {
                        console.error(`Error getting variant for ${item.name}:`, variantError);
                        throw new Error(`Cannot checkout ${item.name}: Invalid product variant`);
                    }
                }

                return {
                    variantId: variantId,
                    quantity: item.quantity,
                };
            });

            // Wait for all variant IDs to be resolved
            const lineItems = await Promise.all(lineItemsPromises);

            console.log('Final line items for checkout:', lineItems);

            // Validate all variant IDs
            const invalidItems = lineItems.filter(item =>
                !item.variantId || !item.variantId.includes('gid://shopify/ProductVariant/')
            );

            if (invalidItems.length > 0) {
                throw new Error('Some items in your cart have invalid variant IDs. Please try removing and re-adding them.');
            }

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lineItems }),
            });

            const result = await response.json();
            console.log('Checkout API response:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Checkout failed');
            }

            // Redirect to Shopify checkout
            if (result.webUrl) {
                console.log('Redirecting to checkout:', result.webUrl);
                window.location.href = result.webUrl;
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (error: any) {
            console.error('Error during checkout:', error);
            alert(error.message || 'Checkout failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className={`modal-cart-block`} onClick={closeModalCart}>
                <div
                    className={`modal-cart-main flex ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="left w-1/2 border-r border-line py-6 max-md:hidden">
                        <div className="heading5 px-6 pb-3">You May Also Like</div>
                        <div className="list px-6">
                            {recommendedLoading ? (
                                // Skeleton loading for recommended products
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                                        <div className="infor flex items-center gap-5 w-full">
                                            <div className="bg-img">
                                                <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg animate-pulse"></div>
                                            </div>
                                            <div className='w-full'>
                                                <div className="name h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <div className="h-4 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
                                                    <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xl bg-gray-200 w-10 h-10 rounded-xl border border-gray-300 animate-pulse"></div>
                                    </div>
                                ))
                            ) : recommendedError ? (
                                <div className="text-red-500 py-5 text-center">
                                    <div className="caption1">Unable to load recommendations</div>
                                </div>
                            ) : recommendedProducts.length === 0 ? (
                                <div className="text-gray-500 py-5 text-center">
                                    <div className="caption1">No recommendations available</div>
                                </div>
                            ) : (
                                recommendedProducts.slice(0, 4).map((product) => (
                                    <div key={product.id} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                                        <div className="infor flex items-center gap-5">
                                            <div className="bg-img">
                                                <Image
                                                    src={product.images[0]}
                                                    width={100}
                                                    height={100}
                                                    alt={product.name}
                                                    className='w-[100px] aspect-square flex-shrink-0 rounded-lg'
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className=''>
                                                <div className="name text-button">{product.name}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="product-price text-title">KES {product.price}</div>
                                                    {product.originPrice && product.originPrice > product.price && (
                                                        <div className="product-origin-price text-title text-secondary2">
                                                            <del>KES {product.originPrice}</del>
                                                        </div>
                                                    )}
                                                    {product.sale && (
                                                        <div className="product-sale caption2 font-semibold bg-red px-3 py-0.5 inline-block rounded-full">
                                                            Sale
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="text-xl bg-white w-10 h-10 rounded-xl border border-black flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleAddToCart(product)
                                            }}
                                        >
                                            <Icon.Handbag />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="right cart-block md:w-1/2 w-full py-6 relative overflow-hidden">
                        <div className="heading px-6 pb-3 flex items-center justify-between relative">
                            <div className="heading5">Shopping Cart</div>
                            <div
                                className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                onClick={closeModalCart}
                            >
                                <Icon.X size={14} />
                            </div>
                        </div>
                        <div className="time px-6">
                            {/*<div className=" flex items-center gap-3 px-5 py-3 bg-green rounded-lg">*/}
                            {/*    <p className='text-3xl'>🔥</p>*/}
                            {/*    <div className="caption1">Your cart will expire in <span className='text-red caption1 font-semibold'>{timeLeft.minutes}:*/}
                            {/*        {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}</span> minutes!<br />*/}
                            {/*        Please checkout now before your items sell out!</div>*/}
                            {/*</div>*/}
                        </div>
                        <div className="heading banner mt-3 px-6">
                            {/*<div className="tow-bar-block mt-3">*/}
                            {/*    <div*/}
                            {/*        className="progress-line"*/}
                            {/*        style={{ width: totalCart <= moneyForFreeship ? `${(totalCart / moneyForFreeship) * 100}%` : `100%` }}*/}
                            {/*    ></div>*/}
                            {/*</div>*/}
                        </div>
                        <div className="list-product px-6">
                            {cartState.cartArray.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="caption1 text-secondary">Your cart is empty</div>
                                </div>
                            ) : (
                                cartState.cartArray.map((product) => (
                                    <div key={product.id} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                                        <div className="infor flex items-center gap-3 w-full">
                                            <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={product.images[0]}
                                                    width={100}
                                                    height={100}
                                                    alt={product.name}
                                                    className='w-full h-full'
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className='w-full'>
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="name text-button">{product.name}</div>
                                                    <div
                                                        className="remove-cart-btn caption1 font-semibold text-red underline cursor-pointer"
                                                        onClick={() => removeFromCart(product.id)}
                                                    >
                                                        Remove
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between gap-2 mt-3 w-full">
                                                    <div className="flex items-center text-secondary2 capitalize">
                                                        <span className="caption1">
                                                            Qty: {product.quantity}
                                                            {(product.selectedSize || product.selectedColor) && (
                                                                <> • {product.selectedSize || 'N/A'}/{product.selectedColor || 'N/A'}</>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="product-price text-title">KES {product.price * product.quantity}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="footer-modal bg-white absolute bottom-0 left-0 w-full">
                            <div className="flex items-center justify-center lg:gap-14 gap-8 px-6 py-4 border-b border-line">
                                <div
                                    className="item flex items-center gap-3 cursor-pointer"
                                    onClick={() => handleActiveTab('note')}
                                >
                                    <Icon.NotePencil className='text-xl' />
                                    <div className="caption1">Note</div>
                                </div>
                                <div
                                    className="item flex items-center gap-3 cursor-pointer"
                                    onClick={() => handleActiveTab('shipping')}
                                >
                                    <Icon.Truck className='text-xl' />
                                    <div className="caption1">Shipping</div>
                                </div>
                                <div
                                    className="item flex items-center gap-3 cursor-pointer"
                                    onClick={() => handleActiveTab('coupon')}
                                >
                                    <Icon.Tag className='text-xl' />
                                    <div className="caption1">Coupon</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-6 px-6">
                                <div className="heading5">Subtotal</div>
                                <div className="heading5">KES {totalCart}</div>
                            </div>
                            <div className="block-button text-center p-6">
                                <div className="flex items-center gap-4">
                                    <button
                                        className={`button-main basis-full text-center uppercase ${isProcessing || cartState.cartArray.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        onClick={handleCheckout}
                                        disabled={isProcessing || cartState.cartArray.length === 0}
                                    >
                                        {isProcessing ? 'Processing...' : 'Check Out'}
                                    </button>
                                </div>
                                <div onClick={closeModalCart} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Or continue shopping</div>
                            </div>
                            <div className={`tab-item note-block ${activeTab === 'note' ? 'active' : ''}`}>
                                <div className="px-6 py-4 border-b border-line">
                                    <div className="item flex items-center gap-3 cursor-pointer">
                                        <Icon.NotePencil className='text-xl' />
                                        <div className="caption1">Note</div>
                                    </div>
                                </div>
                                <div className="form pt-4 px-6">
                                    <textarea name="form-note" id="form-note" rows={4} placeholder='Add special instructions for your order...' className='caption1 py-3 px-4 bg-surface border-line rounded-md w-full'></textarea>
                                </div>
                                <div className="block-button text-center pt-4 px-6 pb-6">
                                    <div className='button-main w-full text-center' onClick={() => setActiveTab('')}>Save</div>
                                    <div onClick={() => setActiveTab('')} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Cancel</div>
                                </div>
                            </div>
                            <div className={`tab-item note-block ${activeTab === 'shipping' ? 'active' : ''}`}>
                                <div className="px-6 py-4 border-b border-line">
                                    <div className="item flex items-center gap-3 cursor-pointer">
                                        <Icon.Truck className='text-xl' />
                                        <div className="caption1">Estimate shipping rates</div>
                                    </div>
                                </div>
                                <div className="form pt-4 px-6">
                                    <div className="">
                                        <label htmlFor='select-country' className="caption1 text-secondary">Country/region</label>
                                        <div className="select-block relative mt-2">
                                            <select
                                                id="select-country"
                                                name="select-country"
                                                className='w-full py-3 pl-5 rounded-xl bg-white border border-line'
                                                defaultValue={'Country/region'}
                                            >
                                                <option value="Country/region" disabled>Country/region</option>
                                                <option value="Kenya">Kenya</option>
                                                <option value="Uganda">Uganda</option>
                                                <option value="Tanzania">Tanzania</option>
                                                <option value="Rwanda">Rwanda</option>
                                            </select>
                                            <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-5 right-2' />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <label htmlFor='select-state' className="caption1 text-secondary">State</label>
                                        <div className="select-block relative mt-2">
                                            <select
                                                id="select-state"
                                                name="select-state"
                                                className='w-full py-3 pl-5 rounded-xl bg-white border border-line'
                                                defaultValue={'State'}
                                            >
                                                <option value="State" disabled>State</option>
                                                <option value="Nairobi">Nairobi</option>
                                                <option value="Mombasa">Mombasa</option>
                                                <option value="Kisumu">Kisumu</option>
                                                <option value="Nakuru">Nakuru</option>
                                            </select>
                                            <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-5 right-2' />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <label htmlFor='select-code' className="caption1 text-secondary">Postal/Zip Code</label>
                                        <input className="border-line px-5 py-3 w-full rounded-xl mt-3" id="select-code" type="text" placeholder="Postal/Zip Code" />
                                    </div>
                                </div>
                                <div className="block-button text-center pt-4 px-6 pb-6">
                                    <div className='button-main w-full text-center' onClick={() => setActiveTab('')}>Calculator</div>
                                    <div onClick={() => setActiveTab('')} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Cancel</div>
                                </div>
                            </div>
                            <div className={`tab-item note-block ${activeTab === 'coupon' ? 'active' : ''}`}>
                                <div className="px-6 py-4 border-b border-line">
                                    <div className="item flex items-center gap-3 cursor-pointer">
                                        <Icon.Tag className='text-xl' />
                                        <div className="caption1">Add A Coupon Code</div>
                                    </div>
                                </div>
                                <div className="form pt-4 px-6">
                                    <div className="">
                                        <label htmlFor='select-discount' className="caption1 text-secondary">Enter Code</label>
                                        <input className="border-line px-5 py-3 w-full rounded-xl mt-3" id="select-discount" type="text" placeholder="Discount code" />
                                    </div>
                                </div>
                                <div className="block-button text-center pt-4 px-6 pb-6">
                                    <div className='button-main w-full text-center' onClick={() => setActiveTab('')}>Apply</div>
                                    <div onClick={() => setActiveTab('')} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Cancel</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalCart