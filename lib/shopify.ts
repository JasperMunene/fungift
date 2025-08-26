// lib/shopify.ts
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is required');
}

if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is required');
}

const client = createStorefrontApiClient({
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    apiVersion: '2025-01',
    publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});

export default client;