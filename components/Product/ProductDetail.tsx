// components/Product/ProductDetail.tsx
'use client'

import React, { useState, useMemo, useEffect } from 'react';
import type { ProductType } from '@/type/ProductType';
import { useCart } from '@/context/CartContext';
import { useModalCartContext } from '@/context/ModalCartContext';
import Image from 'next/image';
import { Heart, ShoppingBag, CheckCircle, Repeat, Eye, Gift, Plus, Minus, Star } from '@phosphor-icons/react';
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
        <div className="product-detail max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl border border-line shadow-sm">
            {/* Images */}
            <div className="product-images relative">
                {isGiftCard && (
                    <div className="gift-card-badge absolute top-3 left-3 z-10">
                        <div className="flex items-center bg-gradient-to-r from-green to-green/80 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                            <Gift size={16} className="mr-1.5" />
                            Gift Card
                        </div>
                    </div>
                )}

                <div className="main-image bg-surface rounded-2xl overflow-hidden mb-4 border border-line relative group">
                    <div className="aspect-square relative overflow-hidden">
                        <Image
                            src={selectedImage}
                            alt={product.name}
                            width={800}
                            height={800}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                        />
                    </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="thumbs">
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {product.images?.map((img: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(img)}
                                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                                    selectedImage === img 
                                        ? 'border-black shadow-lg ring-2 ring-black/20' 
                                        : 'border-line hover:border-black/50'
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.name}-${i}`}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="product-info space-y-6">
                <div className="product-tags flex flex-wrap gap-2">
                    {product.new && (
                        <div className="product-tag text-xs font-semibold uppercase bg-green text-white px-3 py-1.5 rounded-full shadow-sm">
                            New
                        </div>
                    )}
                    {product.sale && originPrice > price && !isGiftCard && (
                        <div className="product-tag text-xs font-semibold uppercase text-white bg-gradient-to-r from-red to-red/80 px-3 py-1.5 rounded-full shadow-sm">
                            Sale -{percentSale}%
                        </div>
                    )}
                    {isGiftCard && (
                        <div className="product-tag text-xs font-semibold uppercase bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full shadow-sm">
                            Digital Delivery
                        </div>
                    )}
                </div>

                <div className="product-header">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-title leading-tight">{product.name}</h1>
                    {/* Rating placeholder - you can integrate actual ratings */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} weight="fill" className="text-yellow-400" />
                            ))}
                        </div>
                        <span className="text-sm text-secondary2">(4.8) • 124 reviews</span>
                    </div>
                </div>

                <div className="price-block">
                    <div className="flex items-baseline gap-3 flex-wrap">
                        <div className="product-price text-2xl sm:text-3xl font-bold text-title">
                            KES {!isNaN(price) ? price.toLocaleString() : '0'}
                        </div>
                        {product.sale && originPrice > price && !isGiftCard && (
                            <div className="product-origin-price text-lg sm:text-xl text-secondary2 line-through">
                                KES {originPrice.toLocaleString()}
                            </div>
                        )}
                    </div>
                    {product.sale && originPrice > price && !isGiftCard && (
                        <div className="text-sm text-green font-medium mt-1">
                            You save KES {(originPrice - price).toLocaleString()}
                        </div>
                    )}
                </div>

                <div className="description text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description || '' }} />

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
                <div className="quantity-actions space-y-4">
                    <div className="quantity-section">
                        <div className="heading text-lg font-semibold mb-4 text-title">Quantity</div>
                        <div className="flex items-center gap-4">
                            <div className="quantity-selector flex items-center border-2 border-line rounded-xl overflow-hidden bg-surface">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={16} weight="bold" />
                                </button>
                                <div className="w-16 h-12 flex items-center justify-center font-semibold text-lg bg-white">{quantity}</div>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <Plus size={16} weight="bold" />
                                </button>
                            </div>
                            
                            <div className="flex-1 text-sm text-secondary2">
                                {product.quantity && (
                                    <span>{product.quantity - (product.sold || 0)} items available</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onBuyNow}
                        disabled={loading || !selectedVariant}
                        className="w-full h-14 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl flex items-center justify-center gap-3 hover:from-gray-800 hover:to-black transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={22} weight="bold" />
                                Buy Now - KES {(price * quantity).toLocaleString()}
                            </>
                        )}
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            className={`action-btn h-12 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-300 font-medium hover:scale-105 ${
                                wishlistState.wishlistArray.some(item => item.id === product.id) 
                                    ? 'bg-red/10 text-red border-red/30 shadow-lg' 
                                    : 'border-line hover:bg-gray-50 hover:border-gray-300'
                            }`}
                            onClick={handleAddToWishlist}
                        >
                            {wishlistState.wishlistArray.some(item => item.id === product.id) ? (
                                <Heart size={20} weight="fill" />
                            ) : (
                                <Heart size={20} />
                            )}
                            {wishlistState.wishlistArray.some(item => item.id === product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                        </button>

                        <button
                            className="action-btn h-12 rounded-xl border-2 border-line flex items-center justify-center gap-2 transition-all duration-300 font-medium hover:scale-105 hover:bg-gray-50 hover:border-gray-300"
                            onClick={() => {/* Add share functionality */}}
                        >
                            <Eye size={20} />
                            Share
                        </button>
                    </div>
                </div>

                {/* Product Meta */}
                <div className="product-meta border-t border-line pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4 text-title">Product Details</h3>
                    <div className="space-y-3">
                        <div className="meta-item flex justify-between items-center py-2">
                            <span className="font-medium text-secondary2">Brand</span>
                            <span className="font-semibold text-title">{product.brand || 'Unknown'}</span>
                        </div>
                        <div className="meta-item flex justify-between items-center py-2 border-t border-line">
                            <span className="font-medium text-secondary2">Category</span>
                            <span className="font-semibold text-title">{product.category}</span>
                        </div>
                        <div className="meta-item flex justify-between items-center py-2 border-t border-line">
                            <span className="font-medium text-secondary2">SKU</span>
                            <span className="font-mono text-sm font-semibold text-title">{selectedVariant?.id || product.id}</span>
                        </div>
                        {product.quantity && (
                            <div className="meta-item flex justify-between items-center py-2 border-t border-line">
                                <span className="font-medium text-secondary2">Stock</span>
                                <span className={`font-semibold ${(product.quantity - (product.sold || 0)) > 10 ? 'text-green' : 'text-red'}`}>
                                    {product.quantity - (product.sold || 0)} available
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}