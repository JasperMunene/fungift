// components/Product/ProductDetail.tsx
'use client'

import React, { useState, useMemo, useEffect } from 'react';
import type { ProductType } from '@/type/ProductType';
import { useCart } from '@/context/CartContext';
import { useModalCartContext } from '@/context/ModalCartContext';
import Image from 'next/image';
import { Heart, ShoppingBag, CheckCircle, Repeat, Eye, Gift } from '@phosphor-icons/react';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';

interface Props {
    product: ProductType;
    shopifyProduct: any;
}

interface ShopifyVariant {
    id: string;
    price: string;
    title: string;
    available: boolean;
    // Add other variant properties you need
}

export default function ProductDetail({ product, shopifyProduct }: Props) {
    const [selectedImage, setSelectedImage] = useState<string>(product.images?.[0] || '');
    const [selectedColor, setSelectedColor] = useState<string | null>(product.variation?.[0]?.color || null);
    const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0] || null);
    const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [isGiftCard, setIsGiftCard] = useState(false);
    const [variants, setVariants] = useState<ShopifyVariant[]>([]);

    // Cart + Modal contexts
    const { addToCart, updateCart } = useCart();
    const { openModalCart } = useModalCartContext();
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
    const { addToCompare, removeFromCompare, compareState } = useCompare();

    // Extract variants from Shopify product
    useEffect(() => {
        if (shopifyProduct?.variants?.edges) {
            const extractedVariants = shopifyProduct.variants.edges.map((edge: any) => ({
                id: edge.node.id,
                price: edge.node.price,
                title: edge.node.title,
                available: edge.node.availableForSale,
                // Extract other properties you need
            }));

            setVariants(extractedVariants);

            // Set initial selected variant
            if (extractedVariants.length > 0) {
                setSelectedVariant(extractedVariants[0]);
            }
        }

        // Check if product is a gift card
        const checkIfGiftCard = () => {
            const giftCardIndicators = [
                product.type?.toLowerCase().includes('gift'),
                product.category?.toLowerCase().includes('gift'),
                product.tags?.some(tag => tag.toLowerCase().includes('gift')),
                product.name?.toLowerCase().includes('gift card')
            ];

            setIsGiftCard(giftCardIndicators.some(indicator => indicator === true));
        };

        checkIfGiftCard();
    }, [shopifyProduct, product]);

    // For gift cards, extract available amounts from variants
    const giftCardAmounts = useMemo(() => {
        if (!isGiftCard || variants.length === 0) return [];

        // Extract unique prices from variants and handle string/number conversion properly
        const amounts = variants
            .map(v => {
                const priceValue = typeof v.price === 'string' ? parseFloat(v.price) : v.price;
                return !isNaN(priceValue) ? priceValue : 0;
            })
            .filter(amount => amount > 0); // Filter out invalid amounts

        return [...new Set(amounts)].sort((a, b) => a - b);
    }, [isGiftCard, variants]);

    // Calculate price with better error handling
    const price = useMemo(() => {
        if (selectedVariant?.price) {
            const parsedPrice = typeof selectedVariant.price === 'string'
                ? parseFloat(selectedVariant.price)
                : selectedVariant.price;

            // Return parsed price if it's a valid number, otherwise fallback to product.price
            if (!isNaN(parsedPrice)) {
                return parsedPrice;
            }
        }

        // Fallback to product price
        return product.price ?? 0;
    }, [selectedVariant, product.price]);

    const originPrice = product.originPrice ?? 0;
    const percentSale = originPrice > price ? Math.floor(100 - ((price / originPrice) * 100)) : 0;

    const handleAddToWishlist = () => {
        if (wishlistState.wishlistArray.some(item => item.id === product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const handleAddToCompare = () => {
        if (compareState.compareArray.some(item => item.id === product.id)) {
            removeFromCompare(product.id);
        } else {
            addToCompare(product);
        }
    };

    // Add to cart (and optionally open modal). Then proceed to create checkout like before.
    const onBuyNow = async () => {
        if (!selectedVariant?.id) {
            alert('Please select a product variant.');
            return;
        }

        setLoading(true);
        try {
            const lineItems = [
                {
                    variantId: selectedVariant.id,
                    quantity,
                    customAttributes: [] as { key: string; value: string }[],
                },
            ];

            // For gift cards, include the custom amount in the metadata
            if (isGiftCard) {
                lineItems[0].customAttributes = [
                    {
                        key: "amount",
                        value: price.toString()
                    }
                ];
            }

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lineItems,
                }),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || 'Failed to create checkout');

            if (json.webUrl) {
                // redirect straight to Shopify checkout
                window.location.href = json.webUrl;
            } else {
                alert('Checkout URL not returned');
            }
        } catch (err: any) {
            console.error('Shopify checkout error', err);
            alert(err?.message || 'Failed to create checkout');
        } finally {
            setLoading(false);
        }
    };

    // Handle variant selection for gift cards
    const handleAmountSelect = (amount: number) => {
        const matchingVariant = variants.find(v => {
            const variantPrice = typeof v.price === 'string' ? parseFloat(v.price) : v.price;
            return !isNaN(variantPrice) && variantPrice === amount;
        });

        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
        }
    };

    return (
        <div className="product-detail grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border border-line">
            {/* Images */}
            <div className="product-images">
                {isGiftCard && (
                    <div className="gift-card-badge absolute top-4 left-4 z-10">
                        <div className="flex items-center bg-green text-white px-3 py-1 rounded-full text-sm font-medium">
                            <Gift size={16} className="mr-1" />
                            Gift Card
                        </div>
                    </div>
                )}

                <div className="main-image bg-white rounded-2xl overflow-hidden mb-4 border border-line relative">
                    <Image
                        src={selectedImage}
                        alt={product.name}
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover aspect-square"
                    />
                </div>
                <div className="thumbs flex gap-3 overflow-x-auto pb-2">
                    {product.images?.map((img: string, i: number) => (
                        <button
                            key={i}
                            onClick={() => setSelectedImage(img)}
                            className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === img ? 'border-black' : 'border-line hover:border-black/50'}`}
                        >
                            <Image
                                src={img}
                                alt={`${product.name}-${i}`}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Details */}
            <div className="product-info">
                <div className="product-tags flex gap-2 mb-4">
                    {product.new && (
                        <div className="product-tag text-button-uppercase bg-green px-3 py-1 inline-block rounded-full">
                            New
                        </div>
                    )}
                    {product.sale && originPrice > price && !isGiftCard && (
                        <div className="product-tag text-button-uppercase text-white bg-red px-3 py-1 inline-block rounded-full">
                            Sale -{percentSale}%
                        </div>
                    )}
                    {isGiftCard && (
                        <div className="product-tag text-button-uppercase bg-blue-500 text-white px-3 py-1 inline-block rounded-full">
                            Digital Delivery
                        </div>
                    )}
                </div>

                <h1 className="text-3xl font-bold mb-3 text-title">{product.name}</h1>

                <div className="price-block flex items-center gap-3 mb-4">
                    <div className="product-price text-2xl font-bold">
                        KES {!isNaN(price) ? price.toFixed(2) : '0.00'}
                    </div>
                    {product.sale && originPrice > price && !isGiftCard && (
                        <div className="product-origin-price text-lg text-secondary2 line-through">
                            KES {originPrice.toFixed(2)}
                        </div>
                    )}
                </div>

                <div className="description mb-6 text-secondary" dangerouslySetInnerHTML={{ __html: product.description || '' }} />

                {/* Amount Selection for Gift Cards */}
                {isGiftCard && giftCardAmounts.length > 0 && (
                    <div className="mb-6">
                        <div className="heading mb-3 font-medium">Select Amount</div>
                        <div className="flex gap-3 flex-wrap">
                            {giftCardAmounts.map((amount: number, idx: number) => {
                                const isSelected = selectedVariant &&
                                    !isNaN(parseFloat(selectedVariant.price)) &&
                                    parseFloat(selectedVariant.price) === amount;

                                return (
                                    <button
                                        key={idx}
                                        className={`amount-item px-4 py-2 flex items-center justify-center rounded-full border transition-all duration-300 ${isSelected ? 'bg-black text-white border-black' : 'border-line hover:border-black'}`}
                                        onClick={() => handleAmountSelect(amount)}
                                    >
                                        ${amount.toFixed(2)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Variant Selection for Regular Products */}
                {!isGiftCard && variants.length > 1 && (
                    <div className="mb-6">
                        <div className="heading mb-3 font-medium">Options</div>
                        <div className="flex gap-3 flex-wrap">
                            {variants.map((variant: ShopifyVariant, idx: number) => (
                                <button
                                    key={idx}
                                    className={`variant-item px-4 py-2 flex items-center justify-center rounded-full border transition-all duration-300 ${selectedVariant?.id === variant.id ? 'bg-black text-white border-black' : 'border-line hover:border-black'}`}
                                    onClick={() => setSelectedVariant(variant)}
                                    disabled={!variant.available}
                                >
                                    {variant.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Colors - Only show for non-gift cards */}
                {!isGiftCard && product.variation && product.variation.length > 0 && (
                    <div className="mb-6">
                        <div className="heading mb-3 font-medium">Color</div>
                        <div className="flex gap-3 flex-wrap">
                            {product.variation.map((v: any, idx: number) => (
                                <button
                                    key={idx}
                                    className={`color-item w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${selectedColor === v.color ? 'border-black scale-110' : 'border-line hover:border-black/50'}`}
                                    onClick={() => {
                                        setSelectedColor(v.color);
                                        if (v.image) setSelectedImage(v.image);
                                    }}
                                    style={{ backgroundColor: v.colorCode }}
                                    title={v.color}
                                >
                                    {selectedColor === v.color && (
                                        <CheckCircle size={16} weight="fill" className="text-white drop-shadow-md" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sizes - Only show for non-gift cards */}
                {!isGiftCard && product.sizes && product.sizes.length > 0 && (
                    <div className="mb-6">
                        <div className="heading mb-3 font-medium">Size</div>
                        <div className="flex gap-3 flex-wrap">
                            {product.sizes.map((s: string, idx: number) => (
                                <button
                                    key={idx}
                                    className={`size-item w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300 ${selectedSize === s ? 'bg-black text-white border-black' : 'border-line hover:border-black'}`}
                                    onClick={() => setSelectedSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity & Actions */}
                <div className="mb-6">
                    <div className="heading mb-3 font-medium">Quantity</div>
                    <div className="flex items-center gap-4">
                        <div className="quantity-selector flex items-center border border-line rounded-full overflow-hidden">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                -
                            </button>
                            <div className="w-12 h-12 flex items-center justify-center">{quantity}</div>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={onBuyNow}
                            disabled={loading || !selectedVariant}
                            className="flex-1 h-12 bg-black text-white rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-60"
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <ShoppingBag size={20} />
                                    Buy Now
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-8">
                    <button
                        className={`action-btn flex-1 h-12 rounded-full border border-line flex items-center justify-center gap-2 transition-colors ${wishlistState.wishlistArray.some(item => item.id === product.id) ? 'bg-red/10 text-red border-red/20' : 'hover:bg-gray-100'}`}
                        onClick={handleAddToWishlist}
                    >
                        {wishlistState.wishlistArray.some(item => item.id === product.id) ? (
                            <Heart size={20} weight="fill" />
                        ) : (
                            <Heart size={20} />
                        )}
                        Wishlist
                    </button>

                    {/*<button*/}
                    {/*    className={`action-btn flex-1 h-12 rounded-full border border-line flex items-center justify-center gap-2 transition-colors ${compareState.compareArray.some(item => item.id === product.id) ? 'bg-green/10 text-green border-green/20' : 'hover:bg-gray-100'}`}*/}
                    {/*    onClick={handleAddToCompare}*/}
                    {/*>*/}
                    {/*    {compareState.compareArray.some(item => item.id === product.id) ? (*/}
                    {/*        <CheckCircle size={20} weight="fill" />*/}
                    {/*    ) : (*/}
                    {/*        <Repeat size={20} />*/}
                    {/*    )}*/}
                    {/*    Compare*/}
                    {/*</button>*/}
                </div>

                {/* Product Meta */}
                <div className="product-meta border-t border-line pt-6">
                    <div className="meta-item flex justify-between py-3 border-b border-line">
                        <span className="font-medium text-secondary2">Brand</span>
                        <span className="font-medium">{product.brand || 'Unknown'}</span>
                    </div>
                    <div className="meta-item flex justify-between py-3 border-b border-line">
                        <span className="font-medium text-secondary2">Category</span>
                        <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="meta-item flex justify-between py-3">
                        <span className="font-medium text-secondary2">SKU</span>
                        <span className="font-medium">{selectedVariant?.id || product.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}