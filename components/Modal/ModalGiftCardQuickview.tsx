'use client'

// GiftCardQuickview.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GiftCardType } from '@/type/GiftCardType';
import { ProductType } from '@/type/ProductType';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalGiftCardQuickviewContext } from '@/context/ModalGiftCardQuickviewContext';
import { useCart } from '@/context/CartContext';
import { useModalCartContext } from '@/context/ModalCartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';

const ModalGiftCardQuickview = () => {
    const [photoIndex, setPhotoIndex] = useState(0)
    const { selectedGiftCard, closeGiftCardQuickview } = useModalGiftCardQuickviewContext()
    const [selectedAmount, setSelectedAmount] = useState<number>(0)
    const [selectedVariantId, setSelectedVariantId] = useState<string>('')
    const [giftCardVariants, setGiftCardVariants] = useState<any[]>([])
    const [isLoadingVariants, setIsLoadingVariants] = useState(false)
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
    const { addToCart, updateCart, cartState } = useCart()
    const { openModalCart } = useModalCartContext()
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist()
    const { openModalWishlist } = useModalWishlistContext()

    // Fetch gift card variants from Shopify when component mounts or gift card changes
    useEffect(() => {
        if (selectedGiftCard?.id) {
            fetchGiftCardVariants();
        }
    }, [selectedGiftCard?.id]);

    const fetchGiftCardVariants = async () => {
        if (!selectedGiftCard?.id) return;

        setIsLoadingVariants(true);
        try {
            const response = await fetch(`/api/get-variants?productId=${encodeURIComponent(selectedGiftCard.id)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch gift card variants');
            }

            const data = await response.json();
            console.log('Gift card variants:', data.variants);

            // Sort variants by price (amount)
            const sortedVariants = data.variants.sort((a: any, b: any) =>
                parseFloat(a.price.amount) - parseFloat(b.price.amount)
            );

            setGiftCardVariants(sortedVariants);

        } catch (error) {
            console.error('Error fetching gift card variants:', error);
            // Fallback to default amounts if API fails
            setGiftCardVariants([
                { id: 'fallback-25', price: { amount: '25.00', currencyCode: 'USD' }, title: '$25 Gift Card', availableForSale: true },
                { id: 'fallback-50', price: { amount: '50.00', currencyCode: 'USD' }, title: '$50 Gift Card', availableForSale: true },
                { id: 'fallback-100', price: { amount: '100.00', currencyCode: 'USD' }, title: '$100 Gift Card', availableForSale: true },
            ]);
        } finally {
            setIsLoadingVariants(false);
        }
    };

    const handleSelectAmount = (amount: number, variantId: string) => {
        setSelectedAmount(amount);
        setSelectedVariantId(variantId);
    };

    const convertGiftCardToProduct = (giftCard: GiftCardType, details: any): ProductType => {
        return {
            ...giftCard,
            ...details,
            quantityPurchase: 1,
            gender: giftCard.gender || 'unisex',
            new: giftCard.new || false,
            sale: giftCard.sale || false,
            rate: giftCard.rate || 5,
            category: giftCard.category || 'gift-cards',
            type: giftCard.type || 'gift-card',
            originPrice: giftCard.originPrice || details.selectedAmount,
            price: details.selectedAmount,
            variantId: details.selectedVariantId,
        }
    };

    const handleAddToCart = () => {
        if (selectedGiftCard && selectedAmount > 0 && selectedVariantId) {
            const giftCardDetails = {
                selectedAmount,
                selectedVariantId,
            };

            const product = convertGiftCardToProduct(selectedGiftCard, giftCardDetails);

            if (!cartState.cartArray.find(item => item.id === selectedGiftCard.id)) {
                addToCart(product);
            } else {
                updateCart(selectedGiftCard.id, 1, '', '')
            }
            openModalCart()
            closeGiftCardQuickview()
        } else {
            alert('Please select a gift card amount');
        }
    };

    const handleBuyItNow = async () => {
        if (!selectedGiftCard || !selectedAmount || !selectedVariantId) {
            alert('Please select a gift card amount');
            return;
        }

        setIsCheckoutLoading(true);

        try {
            console.log('Selected Gift Card:', selectedGiftCard);
            console.log('Selected Amount:', selectedAmount);
            console.log('Selected Variant ID:', selectedVariantId);

            // Validate variant ID format
            if (!selectedVariantId.includes('gid://shopify/ProductVariant/')) {
                throw new Error(`Invalid variant ID format: ${selectedVariantId}`);
            }

            // Prepare line items for checkout
            const lineItems = [{
                variantId: selectedVariantId,
                quantity: 1,
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
                console.log('Redirecting to:', result.webUrl);
                window.location.href = result.webUrl;
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (error: any) {
            console.error('Gift card checkout error:', error);
            alert(error.message || 'Failed to initiate checkout. Please try again.');
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const handleAddToWishlist = () => {
        if (selectedGiftCard) {
            const product = convertGiftCardToProduct(selectedGiftCard, {
                selectedAmount: selectedAmount || 25, // Default amount for wishlist
                selectedVariantId: selectedVariantId || (giftCardVariants[0]?.id || '')
            });

            if (wishlistState.wishlistArray.some(item => item.id === product.id)) {
                removeFromWishlist(product.id);
            } else {
                addToWishlist(product);
            }
        }
        openModalWishlist();
    };

    const isFormValid = selectedAmount > 0 && selectedVariantId;

    return (
        <>
            <div className={`modal-quickview-block`} onClick={closeGiftCardQuickview}>
                <div
                    className={`modal-quickview-main py-6 ${selectedGiftCard !== null ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="flex h-full max-md:flex-col-reverse gap-y-6">
                        <div className="left lg:w-[388px] md:w-[300px] flex-shrink-0 px-6">
                            <div className="list-img max-md:flex items-center gap-4">
                                {selectedGiftCard?.images.map((item, index) => (
                                    <div className="bg-img w-full aspect-[3/2] max-md:w-[200px] max-md:flex-shrink-0 rounded-[20px] overflow-hidden md:mt-6" key={index}>
                                        <Image
                                            src={item}
                                            width={1500}
                                            height={1000}
                                            alt="Gift Card Design"
                                            priority={true}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="right w-full px-4">
                            <div className="heading pb-6 px-4 flex items-center justify-between relative">
                                <div className="heading5">Gift Card Quick View</div>
                                <div
                                    className="close-btn absolute right-0 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                    onClick={closeGiftCardQuickview}
                                >
                                    <Icon.X size={14} />
                                </div>
                            </div>
                            <div className="product-infor px-4">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="caption2 text-secondary font-semibold uppercase">Gift Card</div>
                                        <div className="heading4 mt-1">{selectedGiftCard?.name}</div>
                                    </div>
                                    <div
                                        className={`add-wishlist-btn w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-lg duration-300 flex-shrink-0 hover:bg-black hover:text-white ${wishlistState.wishlistArray.some(item => item.id === selectedGiftCard?.id) ? 'active' : ''}`}
                                        onClick={handleAddToWishlist}
                                    >
                                        {wishlistState.wishlistArray.some(item => item.id === selectedGiftCard?.id) ? (
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

                                <div className="mt-5 pb-6 border-b border-line">
                                    {selectedAmount > 0 && (
                                        <div className="product-price heading5">KES {selectedAmount}.00</div>
                                    )}
                                    <div className='desc text-secondary mt-3'>{selectedGiftCard?.description}</div>
                                </div>

                                <div className="list-action mt-6">
                                    {/* Gift Card Amount Selection */}
                                    <div className="choose-amount">
                                        <div className="text-title mb-3">
                                            Select Amount:
                                            <span className='text-title ml-2'>
                                                {selectedAmount > 0 ? `KES ${selectedAmount}` : 'Please select'}
                                            </span>
                                        </div>

                                        {isLoadingVariants ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="text-secondary">Loading gift card amounts...</div>
                                            </div>
                                        ) : (
                                            <div className="list-amounts grid grid-cols-3 gap-3 mt-3">
                                                {giftCardVariants.map((variant, index) => {
                                                    const amount = Math.floor(parseFloat(variant.price.amount));
                                                    const currencySymbol = variant.price.currencyCode === 'USD' ? '$' : 'KES ';

                                                    return (
                                                        <div
                                                            className={`amount-item h-12 flex items-center justify-center text-button rounded-lg bg-white border border-line cursor-pointer duration-300 hover:border-black ${selectedAmount === amount ? 'active border-black bg-black text-white' : ''} ${!variant.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            key={index}
                                                            onClick={() => variant.availableForSale && handleSelectAmount(amount, variant.id)}
                                                        >
                                                            KES {amount}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {!isLoadingVariants && giftCardVariants.length === 0 && (
                                            <div className="text-center text-secondary py-4">
                                                No gift card amounts available
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="button-block mt-6">
                                        <div className="flex gap-4">
                                            <div
                                                onClick={isFormValid ? handleAddToCart : undefined}
                                                className={`button-main w-full text-center ${isFormValid ? 'bg-white text-black border border-black cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                            >
                                                Add To Cart
                                            </div>
                                        </div>
                                    </div>

                                    <div className="button-block mt-3">
                                        <div
                                            onClick={isFormValid && !isCheckoutLoading ? handleBuyItNow : undefined}
                                            className={`button-main w-full text-center ${isFormValid && !isCheckoutLoading ? 'bg-black text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            {isCheckoutLoading ? 'Processing...' : 'Buy It Now'}
                                        </div>

                                        {!isFormValid && (
                                            <div className="caption1 text-red mt-2 text-center">
                                                Please select a gift card amount
                                            </div>
                                        )}
                                    </div>

                                    {/* Gift Card Info */}
                                    <div className="gift-card-info mt-6 p-4 bg-surface rounded-lg">
                                        <div className="text-title mb-2">Gift Card Information</div>
                                        <div className="text-secondary caption1">
                                            • Digital gift card delivered via email<br/>
                                            • No expiration date<br/>
                                            • Can be used for any purchase on our website<br/>
                                            • Remaining balance can be used for future purchases
                                        </div>
                                    </div>

                                    {/* Share Section */}
                                    <div className="flex items-center justify-center mt-5">
                                        <div className="share flex items-center gap-3 cursor-pointer">
                                            <div className="share-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                                                <Icon.ShareNetwork weight='fill' className='heading6' />
                                            </div>
                                            <span>Share Gift Card</span>
                                        </div>
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

export default ModalGiftCardQuickview;