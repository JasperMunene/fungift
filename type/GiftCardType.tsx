// GiftCardType.ts
interface Variation {
    color: string;
    colorCode?: string;
    colorImage: string;
    image: string;
}

export interface GiftCardType {
    id: string;
    name: string;
    description: string;
    gender: string;
    images: string[];
    category: string;
    type: string;
    availableAmounts: number[];
    minAmount?: number;
    maxAmount?: number;
    isActive: boolean;
    termsAndConditions?: string;
    new: boolean;
    sale: boolean;
    rate: number;
    price: number,
    originPrice: number,
    brand: string,
    sold?: number,
    discount?: number;
    quantity?: number,
    sizes: Array<string>,
    thumbImage: Array<string>,
    variation: Variation[],
    action: string,
    slug: string,
    discountPolicy?: string;
    expiryDate?: string;
    expiryPolicy?: string;
    createdAt?: string;
    updatedAt?: string;

    // Optional fields for cart functionality
    selectedAmount?: number;
    recipientName?: string;
    recipientEmail?: string;
    senderName?: string;
    personalMessage?: string;
    deliveryDate?: string;
    quantityPurchase?: number;
}