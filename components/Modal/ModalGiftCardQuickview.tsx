'use client'

// GiftCardQuickview.tsx
import React, { useState } from 'react';
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
    const [recipientName, setRecipientName] = useState<string>('')
    const [recipientEmail, setRecipientEmail] = useState<string>('')
    const [senderName, setSenderName] = useState<string>('')
    const [personalMessage, setPersonalMessage] = useState<string>('')
    const [deliveryDate, setDeliveryDate] = useState<string>('')
    const { addToCart, updateCart, cartState } = useCart()
    const { openModalCart } = useModalCartContext()
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist()
    const { openModalWishlist } = useModalWishlistContext()

    // Predefined gift card amounts
    const giftCardAmounts = [25, 50, 100, 150, 200, 300, 500]

    const handleSelectAmount = (amount: number) => {
        setSelectedAmount(amount)
    }

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
        }

    };

    const handleAddToCart = () => {
        if (selectedGiftCard && selectedAmount > 0) {
            const giftCardDetails = {
                selectedAmount,
                recipientName,
                recipientEmail,
                senderName,
                personalMessage,
                deliveryDate,
            };

            const product = convertGiftCardToProduct(selectedGiftCard, giftCardDetails);

            if (!cartState.cartArray.find(item => item.id === selectedGiftCard.id)) {
                addToCart(product);
            } else {
                updateCart(selectedGiftCard.id, 1, '', '')
            }
            openModalCart()
            closeGiftCardQuickview()
        }
    };

    const handleAddToWishlist = () => {
        if (selectedGiftCard) {
            const product = convertGiftCardToProduct(selectedGiftCard, { selectedAmount });

            if (wishlistState.wishlistArray.some(item => item.id === product.id)) {
                removeFromWishlist(product.id);
            } else {
                addToWishlist(product);
            }
        }
        openModalWishlist();
    };
    const isFormValid = selectedAmount > 0 && recipientName.trim() && recipientEmail.trim() && senderName.trim()

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
                                        <div className="product-price heading5">${selectedAmount}.00</div>
                                    )}
                                    <div className='desc text-secondary mt-3'>{selectedGiftCard?.description}</div>
                                </div>

                                <div className="list-action mt-6">
                                    {/* Gift Card Amount Selection */}
                                    <div className="choose-amount">
                                        <div className="text-title mb-3">Select Amount: <span className='text-title'>{selectedAmount > 0 ? `$${selectedAmount}` : 'Please select'}</span></div>
                                        <div className="list-amounts grid grid-cols-4 gap-3 mt-3">
                                            {giftCardAmounts.map((amount, index) => (
                                                <div
                                                    className={`amount-item h-12 flex items-center justify-center text-button rounded-lg bg-white border border-line cursor-pointer duration-300 hover:border-black ${selectedAmount === amount ? 'active border-black bg-black text-white' : ''}`}
                                                    key={index}
                                                    onClick={() => handleSelectAmount(amount)}
                                                >
                                                    ${amount}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recipient Information */}
                                    <div className="recipient-info mt-6">
                                        <div className="text-title mb-3">Recipient Information</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="input-group">
                                                <label className="caption1 text-secondary mb-2 block">Recipient Name *</label>
                                                <input
                                                    type="text"
                                                    value={recipientName}
                                                    onChange={(e) => setRecipientName(e.target.value)}
                                                    className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:border-black"
                                                    placeholder="Enter recipient name"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="caption1 text-secondary mb-2 block">Recipient Email *</label>
                                                <input
                                                    type="email"
                                                    value={recipientEmail}
                                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                                    className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:border-black"
                                                    placeholder="Enter recipient email"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sender Information */}
                                    <div className="sender-info mt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="input-group">
                                                <label className="caption1 text-secondary mb-2 block">Your Name *</label>
                                                <input
                                                    type="text"
                                                    value={senderName}
                                                    onChange={(e) => setSenderName(e.target.value)}
                                                    className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:border-black"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="caption1 text-secondary mb-2 block">Delivery Date (Optional)</label>
                                                <input
                                                    type="date"
                                                    value={deliveryDate}
                                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                                    className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:border-black"
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personal Message */}
                                    <div className="personal-message mt-4">
                                        <label className="caption1 text-secondary mb-2 block">Personal Message (Optional)</label>
                                        <textarea
                                            value={personalMessage}
                                            onChange={(e) => setPersonalMessage(e.target.value)}
                                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:border-black resize-none"
                                            rows={4}
                                            placeholder="Write a personal message..."
                                            maxLength={200}
                                        />
                                        <div className="text-right caption1 text-secondary mt-1">
                                            {personalMessage.length}/200 characters
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <div className="button-block mt-6">
                                        <div
                                            onClick={isFormValid ? handleAddToCart : undefined}
                                            className={`button-main w-full text-center ${isFormValid ? 'bg-black text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            Add Gift Card To Cart
                                        </div>
                                        {!isFormValid && (
                                            <div className="caption1 text-red mt-2 text-center">
                                                Please fill in all required fields and select an amount
                                            </div>
                                        )}
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

                                    {/* Gift Card Info */}
                                    <div className="more-infor mt-6">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <div className="flex items-center gap-1">
                                                <Icon.Gift className='body1' />
                                                <div className="text-title">Digital Delivery</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Icon.Clock className='body1' />
                                                <div className="text-title">Never Expires</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center flex-wrap gap-1 mt-3">
                                            <Icon.CreditCard className='body1' />
                                            <span className="text-title">Redeemable online and in-store</span>
                                        </div>
                                        <div className="flex items-center flex-wrap gap-1 mt-3">
                                            <Icon.ShieldCheck className='body1' />
                                            <span className="text-title">Secure digital delivery</span>
                                        </div>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="list-payment mt-7">
                                        <div className="main-content lg:pt-8 pt-6 lg:pb-6 pb-4 sm:px-4 px-3 border border-line rounded-xl relative max-md:w-2/3 max-sm:w-full">
                                            <div className="heading6 px-5 bg-white absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap">Guaranteed safe checkout</div>
                                            <div className="list grid grid-cols-6">
                                                <div className="item flex items-center justify-center lg:px-3 px-1">
                                                    <Image
                                                        src={'/images/payment/Frame-0.png'}
                                                        width={500}
                                                        height={450}
                                                        alt='payment'
                                                        className='w-full'
                                                    />
                                                </div>
                                                <div className="item flex items-center justify-center lg:px-3 px-1">
                                                    <Image
                                                        src={'/images/payment/Frame-1.png'}
                                                        width={500}
                                                        height={450}
                                                        alt='payment'
                                                        className='w-full'
                                                    />
                                                </div>
                                                <div className="item flex items-center justify-center lg:px-3 px-1">
                                                    <Image
                                                        src={'/images/payment/Frame-2.png'}
                                                        width={500}
                                                        height={450}
                                                        alt='payment'
                                                        className='w-full'
                                                    />
                                                </div>
                                                <div className="item flex items-center justify-center lg:px-3 px-1">
                                                    <Image
                                                        src={'/images/payment/Frame-3.png'}
                                                        width={500}
                                                        height={450}
                                                        alt='payment'
                                                        className='w-full'
                                                    />
                                                </div>
                                                <div className="item flex items-center justify-center lg:px-3 px-1">
                                                    <Image
                                                        src={'/images/payment/Frame-4.png'}
                                                        width={500}
                                                        height={450}
                                                        alt='payment'
                                                        className='w-full'
                                                    />
                                                </div>
                                                <div className="item flex items-center justify-center lg:px-3 px-1">
                                                    <Image
                                                        src={'/images/payment/Frame-5.png'}
                                                        width={500}
                                                        height={450}
                                                        alt='payment'
                                                        className='w-full'
                                                    />
                                                </div>
                                            </div>
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