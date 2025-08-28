// app/api/get-variants/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
        return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }

    try {
        const query = `
            query getProductVariants($id: ID!) {
                product(id: $id) {
                    id
                    title
                    variants(first: 100) {
                        edges {
                            node {
                                id
                                title
                                price {
                                    amount
                                    currencyCode
                                }
                                selectedOptions {
                                    name
                                    value
                                }
                                availableForSale
                            }
                        }
                    }
                }
            }
        `;

        const variables = {
            id: productId
        };

        const response = await fetch(
            `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token':
                        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
                },
                body: JSON.stringify({ query, variables }),
            }
        );

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors.map((e: any) => e.message).join(', '));
        }

        const product = result.data?.product;
        if (!product) {
            throw new Error('Product not found');
        }

        const variants = product.variants.edges.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            price: edge.node.price,
            selectedOptions: edge.node.selectedOptions,
            availableForSale: edge.node.availableForSale
        }));

        return NextResponse.json({
            productId: product.id,
            productTitle: product.title,
            variants
        });

    } catch (error: any) {
        console.error('Get variants error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get variants' },
            { status: 500 }
        );
    }
}