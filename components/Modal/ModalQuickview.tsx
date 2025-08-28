'use client'

// Quickview.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalQuickviewContext } from '@/context/ModalQuickviewContext';
import { useCart } from '@/context/CartContext';
import { useModalCartContext } from '@/context/ModalCartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useCompare } from '@/context/CompareContext'
import { useModalCompareContext } from '@/context/ModalCompareContext'


const ModalQuickview = () => {
    const [photoIndex, setPhotoIndex] = useState(0)
    const [openPopupImg, setOpenPopupImg] = useState(false)
    const [openSizeGuide, setOpenSizeGuide] = useState<boolean>(false)
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
    const { selectedProduct, closeQuickview } = useModalQuickviewContext()
    const [activeColor, setActiveColor] = useState<string>('')
    const [activeSize, setActiveSize] = useState<string>('')
    const { addToCart, updateCart, cartState } = useCart()
    const { openModalCart } = useModalCartContext()
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist()
    const { openModalWishlist } = useModalWishlistContext()
    const { addToCompare, removeFromCompare, compareState } = useCompare();
    const { openModalCompare } = useModalCompareContext()
    const percentSale = selectedProduct && Math.floor(100 - ((selectedProduct.price / selectedProduct.originPrice) * 100))

    const handleOpenSizeGuide = () => {
        setOpenSizeGuide(true);
    };

    const handleCloseSizeGuide = () => {
        setOpenSizeGuide(false);
    };

    const handleActiveColor = (item: string) => {
        setActiveColor(item)
    }

    const handleActiveSize = (item: string) => {
        setActiveSize(item)
    }

    const handleIncreaseQuantity = () => {
        if (selectedProduct) {
            selectedProduct.quantityPurchase += 1
            updateCart(selectedProduct.id, selectedProduct.quantityPurchase + 1, activeSize, activeColor);
        }
    };

    const handleDecreaseQuantity = () => {
        if (selectedProduct && selectedProduct.quantityPurchase > 1) {
            selectedProduct.quantityPurchase -= 1
            updateCart(selectedProduct.id, selectedProduct.quantityPurchase - 1, activeSize, activeColor);
        }
    };

    const handleAddToCart = () => {
        if (selectedProduct) {
            if (!cartState.cartArray.find(item => item.id === selectedProduct.id)) {
                addToCart({ ...selectedProduct });
                updateCart(selectedProduct.id, selectedProduct.quantityPurchase, activeSize, activeColor)
            } else {
                updateCart(selectedProduct.id, selectedProduct.quantityPurchase, activeSize, activeColor)
            }
            openModalCart()
            closeQuickview()
        }
    };

    const handleBuyItNow = async () => {
        if (!selectedProduct) return;

        // Validation - ensure size and color are selected if required
        if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !activeSize) {
            alert('Please select a size');
            return;
        }

        if (selectedProduct.variation && selectedProduct.variation.length > 0 && !activeColor) {
            alert('Please select a color');
            return;
        }

        setIsCheckoutLoading(true);

        try {
            // Debug: Log the product data to see what's available
            console.log('Selected Product:', selectedProduct);
            console.log('Active Size:', activeSize);
            console.log('Active Color:', activeColor);

            // Get the correct variant ID - MUST be a ProductVariant ID, not Product ID
            let variantId = selectedProduct.variantId;

            // If no variantId but we have variations, try to find the matching variant
            if (!variantId && selectedProduct.variation && activeColor) {
                const selectedVariation = selectedProduct.variation.find(v => v.color === activeColor);
                variantId = selectedVariation?.variantId || selectedVariation?.id;
            }

            // Check if we have a valid variant ID or if it's actually a product ID
            const needsVariantFetch = !variantId ||
                variantId.includes('gid://shopify/Product/') ||
                !variantId.includes('gid://shopify/ProductVariant/');

            // If we need to fetch variant ID from Shopify
            if (needsVariantFetch) {
                console.log('No variant ID found, fetching from Shopify...');

                // Get the first available variant for this product
                const variantsResponse = await fetch(`/api/get-variants?productId=${encodeURIComponent(selectedProduct.id)}`);

                if (variantsResponse.ok) {
                    const variantsData = await variantsResponse.json();
                    const variants = variantsData.variants;

                    if (variants && variants.length > 0) {
                        // Use the first available variant or find one matching selected options
                        let selectedVariant = variants[0]; // Default to first variant

                        // Try to find variant matching selected color/size
                        if (activeColor || activeSize) {
                            const matchingVariant = variants.find((v: any) =>
                                v.selectedOptions.some((opt: any) =>
                                    (opt.name.toLowerCase() === 'color' && opt.value.toLowerCase() === activeColor?.toLowerCase()) ||
                                    (opt.name.toLowerCase() === 'size' && opt.value.toLowerCase() === activeSize?.toLowerCase())
                                )
                            );
                            if (matchingVariant) {
                                selectedVariant = matchingVariant;
                            }
                        }

                        variantId = selectedVariant.id;
                        console.log('Found variant ID:', variantId);
                    } else {
                        throw new Error('No variants found for this product');
                    }
                } else {
                    throw new Error('Failed to fetch product variants');
                }
            }

            // Validate that we have a variant ID in the correct format
            if (!variantId || !variantId.includes('gid://shopify/ProductVariant/')) {
                throw new Error(`Invalid variant ID format: ${variantId}. Must be a Shopify ProductVariant Global ID.`);
            }

            // Prepare line items for checkout - simplified structure
            const lineItems = [{
                variantId: variantId,
                quantity: selectedProduct.quantityPurchase || 1,
            }];

            console.log('Line items being sent:', lineItems);

            // Call the checkout API
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lineItems
                }),
            });

            const result = await response.json();
            console.log('Checkout API response:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Checkout failed');
            }

            // Redirect to Shopify checkout
            if (result.webUrl) {
                window.location.href = result.webUrl;
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(error.message || 'Failed to initiate checkout. Please try again.');
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const handleAddToWishlist = () => {
        // if product existed in wishlit, remove from wishlist and set state to false
        if (selectedProduct) {
            if (wishlistState.wishlistArray.some(item => item.id === selectedProduct.id)) {
                removeFromWishlist(selectedProduct.id);
            } else {
                // else, add to wishlist and set state to true
                addToWishlist(selectedProduct);
            }
        }
        openModalWishlist();
    };

    const handleAddToCompare = () => {
        // if product existed in wishlit, remove from wishlist and set state to false
        if (selectedProduct) {
            if (compareState.compareArray.length < 3) {
                if (compareState.compareArray.some(item => item.id === selectedProduct.id)) {
                    removeFromCompare(selectedProduct.id);
                } else {
                    // else, add to wishlist and set state to true
                    addToCompare(selectedProduct);
                }
            } else {
                alert('Compare up to 3 products')
            }
        }
        openModalCompare();
    };

    return (
        <>
            <div className={`modal-quickview-block`} onClick={closeQuickview}>
                <div
                    className={`modal-quickview-main py-6 ${selectedProduct !== null ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="flex h-full max-md:flex-col-reverse gap-y-6">
                        <div className="left lg:w-[388px] md:w-[300px] flex-shrink-0 px-6">
                            <div className="list-img max-md:flex items-center gap-4">
                                {selectedProduct?.images.map((item, index) => (
                                    <div className="bg-img w-full aspect-[3/4] max-md:w-[150px] max-md:flex-shrink-0 rounded-[20px] overflow-hidden md:mt-6" key={index}>
                                        <Image
                                            src={item}
                                            width={1500}
                                            height={2000}
                                            alt={item}
                                            priority={true}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="right w-full px-4">
                            <div className="heading pb-6 px-4 flex items-center justify-between relative">
                                <div className="heading5">Quick View</div>
                                <div
                                    className="close-btn absolute right-0 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                    onClick={closeQuickview}
                                >
                                    <Icon.X size={14} />
                                </div>
                            </div>
                            <div className="product-infor px-4">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="caption2 text-secondary font-semibold uppercase">{selectedProduct?.type}</div>
                                        <div className="heading4 mt-1">{selectedProduct?.name}</div>
                                    </div>
                                    <div
                                        className={`add-wishlist-btn w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-lg duration-300 flex-shrink-0 hover:bg-black hover:text-white ${wishlistState.wishlistArray.some(item => item.id === selectedProduct?.id) ? 'active' : ''}`}
                                        onClick={handleAddToWishlist}
                                    >
                                        {wishlistState.wishlistArray.some(item => item.id === selectedProduct?.id) ? (
                                            <>
                                                <Icon.Heart size={20} weight='fill' className='text-red' />
                                            </>
                                        ) : (
                                            <>
                                                <Icon.Heart size={20} />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap mt-5 pb-6 border-b border-line">
                                    <div className="product-price heading5">KES {selectedProduct?.price}.00</div>
                                    <div className='w-px h-4 bg-line'></div>
                                    <div className='desc text-secondary mt-3'>{selectedProduct?.description}</div>
                                </div>
                                <div className="list-action mt-6">
                                    <div className="choose-color">

                                        <div className="list-color flex items-center gap-2 flex-wrap mt-3">
                                            {selectedProduct?.variation.map((item, index) => (
                                                <div
                                                    className={`color-item w-12 h-12 rounded-xl duration-300 relative ${activeColor === item.color ? 'active' : ''}`}
                                                    key={index}
                                                    datatype={item.image}
                                                    onClick={() => {
                                                        handleActiveColor(item.color)
                                                    }}
                                                >
                                                    <Image
                                                        src={item.colorImage}
                                                        width={100}
                                                        height={100}
                                                        alt='color'
                                                        className='rounded-xl'
                                                    />
                                                    <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                                                        {item.color}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="choose-size mt-5">
                                        <div className="heading flex items-center justify-between">
                                            <div className="text-title">Size: <span className='text-title size'>{activeSize}</span></div>

                                        </div>
                                        <div className="list-size flex items-center gap-2 flex-wrap mt-3">
                                            {selectedProduct?.sizes.map((item, index) => (
                                                <div
                                                    className={`size-item ${item === 'freesize' ? 'px-3 py-2' : 'w-12 h-12'} flex items-center justify-center text-button rounded-full bg-white border border-line ${activeSize === item ? 'active' : ''}`}
                                                    key={index}
                                                    onClick={() => handleActiveSize(item)}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-title mt-5">Quantity:</div>
                                    <div className="choose-quantity flex items-center max-xl:flex-wrap lg:justify-between gap-5 mt-3">
                                        <div className="quantity-block md:p-3 max-md:py-1.5 max-md:px-3 flex items-center justify-between rounded-lg border border-line sm:w-[180px] w-[120px] flex-shrink-0">
                                            <Icon.Minus
                                                onClick={handleDecreaseQuantity}
                                                className={`${selectedProduct?.quantityPurchase === 1 ? 'disabled' : ''} cursor-pointer body1`}
                                            />
                                            <div className="body1 font-semibold">{selectedProduct?.quantityPurchase}</div>
                                            <Icon.Plus
                                                onClick={handleIncreaseQuantity}
                                                className='cursor-pointer body1'
                                            />
                                        </div>
                                        <div onClick={handleAddToCart} className="button-main w-full text-center bg-white text-black border border-black">Add To Cart</div>
                                    </div>
                                    <div className="button-block mt-5">
                                        <div
                                            onClick={handleBuyItNow}
                                            className={`button-main w-full text-center ${isCheckoutLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {isCheckoutLoading ? 'Processing...' : 'Buy It Now'}
                                        </div>
                                    </div>

                                    <div className="list-payment mt-7">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ModalQuickview;