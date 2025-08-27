// Create: app/api/test-shopify/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Simple query to get shop info
        const query = `
            query {
                shop {
                    name
                    primaryDomain {
                        url
                    }
                    paymentSettings {
                        currencyCode
                    }
                }
                products(first: 1) {
                    edges {
                        node {
                            id
                            title
                            variants(first: 1) {
                                edges {
                                    node {
                                        id
                                        title
                                        price {
                                            amount
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        console.log('Testing Shopify connection...');
        console.log('Store Domain:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
        console.log('Has Token:', !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN);

        const response = await fetch(
            `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
                },
                body: JSON.stringify({ query }),
            }
        );

        console.log('Response status:', response.status);

        const result = await response.json();
        console.log('Response:', JSON.stringify(result, null, 2));

        return NextResponse.json({
            success: response.ok,
            status: response.status,
            data: result,
        });

    } catch (err: any) {
        console.error('Test error:', err);
        return NextResponse.json(
            { error: err.message, success: false },
            { status: 500 }
        );
    }
}