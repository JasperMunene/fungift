// types/shopify.ts
export interface ShopifyImage {
    url: string;
    altText?: string | undefined;
}

export interface ShopifyPrice {
    amount: string;
    currencyCode: string;
}

export interface ShopifyVariant {
    id: string;
    title: string;
    price: ShopifyPrice;
    availableForSale: boolean;
    sku: string;
    image?: ShopifyImage;
}

export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    productType?: string;
    images: {
        edges: Array<{
            node: ShopifyImage;
        }>;
    };
    variants: {
        edges: Array<{
            node: ShopifyVariant;
        }>;
    };
}

export interface ShopifyProductsResponse {
    products: {
        edges: Array<{
            node: ShopifyProduct;
        }>;
    };
}

export interface ShopifyProductResponse {
    product: ShopifyProduct;
}

export interface CheckoutLineItem {
    variantId: string;
    quantity: number;
}

export interface CheckoutInput {
    lineItems: CheckoutLineItem[];
}

export interface Checkout {
    id: string;
    webUrl: string;
    lineItems: {
        edges: Array<{
            node: {
                title: string;
                quantity: number;
            };
        }>;
    };
}

export interface CheckoutCreateResponse {
    checkoutCreate: {
        checkout: Checkout | null;
        checkoutUserErrors: Array<{
            field: string[];
            message: string;
        }>;
    };
}

