// lib/shopify-service.ts
import client from './shopify';
import { GET_PRODUCTS, GET_PRODUCT, CHECKOUT_CREATE } from './shopify-queries';
import type {
    ShopifyProductsResponse,
    ShopifyProductResponse,
    CheckoutInput,
    CheckoutCreateResponse,
} from '@/type/shopify';

export async function getProducts(first: number = 20): Promise<ShopifyProductsResponse> {
    try {
        const response = await client.request(GET_PRODUCTS, {
            variables: { first },
        });
        return response.data as ShopifyProductsResponse;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
}

export async function getProduct(handle: string): Promise<ShopifyProductResponse> {
    try {
        const response = await client.request(GET_PRODUCT, {
            variables: { handle },
        });
        return response.data as ShopifyProductResponse;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error('Failed to fetch product');
    }
}

export async function createCheckout(input: CheckoutInput): Promise<string> {
    try {
        const response = await client.request(CHECKOUT_CREATE, {
            variables: { input },
        });

        const data = response.data as CheckoutCreateResponse;

        if (data.checkoutCreate.checkoutUserErrors.length > 0) {
            throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
        }

        if (!data.checkoutCreate.checkout) {
            throw new Error('Failed to create checkout');
        }

        return data.checkoutCreate.checkout.webUrl;
    } catch (error) {
        console.error('Error creating checkout:', error);
        throw new Error('Failed to create checkout');
    }
}