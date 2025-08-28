// app/api/checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { lineItems } = body;

        console.log('Received checkout request:', { lineItems });

        if (!Array.isArray(lineItems) || lineItems.length === 0) {
            return NextResponse.json({ error: 'lineItems required' }, { status: 400 });
        }

        // Validate that all lineItems have variantId
        for (const item of lineItems) {
            if (!item.variantId) {
                console.error('Missing variantId in lineItem:', item);
                return NextResponse.json({ error: 'All lineItems must have a variantId' }, { status: 400 });
            }
        }

        const query = `
            mutation cartCreate($input: CartInput!) {
                cartCreate(input: $input) {
                    cart {
                        id
                        checkoutUrl
                        totalQuantity
                        cost {
                            totalAmount {
                                amount
                                currencyCode
                            }
                        }
                        lines(first: 10) {
                            edges {
                                node {
                                    id
                                    quantity
                                    merchandise {
                                        ... on ProductVariant {
                                            id
                                            title
                                            price {
                                                amount
                                                currencyCode
                                            }
                                            product {
                                                title
                                                id
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const variables = {
            input: {
                lines: lineItems.map((li: any) => ({
                    merchandiseId: li.variantId,
                    quantity: li.quantity || 1,
                })),
                attributes: [
                    {
                        key: "source",
                        value: "your-website"
                    }
                ],
                note: "Order from custom website"
            },
        };

        console.log('Sending to Shopify:', {
            query: query.slice(0, 100) + '...',
            variables
        });

        // Check environment variables
        if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
            throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN not configured');
        }
        if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
            throw new Error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN not configured');
        }

        const shopifyUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`;
        console.log('Shopify URL:', shopifyUrl);

        const response = await fetch(shopifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token':
                    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            console.error('Shopify API response not ok:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Shopify error response:', errorText);
            throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Full Shopify response:', JSON.stringify(result, null, 2));

        // Check for GraphQL errors
        if (result.errors) {
            console.error('GraphQL errors:', result.errors);
            return NextResponse.json(
                { error: `GraphQL error: ${result.errors.map((e: any) => e.message).join(', ')}` },
                { status: 400 }
            );
        }

        const cart = result.data?.cartCreate?.cart;
        const userErrors = result.data?.cartCreate?.userErrors || [];

        if (userErrors.length > 0) {
            console.error('Shopify user errors:', userErrors);
            return NextResponse.json(
                { error: userErrors.map((e: any) => `${e.field}: ${e.message}`).join(', ') },
                { status: 400 }
            );
        }

        if (!cart) {
            console.error('No cart returned from Shopify');
            return NextResponse.json(
                { error: 'No cart returned from Shopify' },
                { status: 500 }
            );
        }

        if (!cart.checkoutUrl) {
            console.error('No checkout URL in cart:', cart);
            return NextResponse.json(
                { error: 'No checkout URL returned from Shopify' },
                { status: 500 }
            );
        }

        console.log('Cart created successfully:', {
            cartId: cart.id,
            checkoutUrl: cart.checkoutUrl,
            totalQuantity: cart.totalQuantity
        });

        // Store minimal purchase information in your database
        try {
            const purchaseData = {
                cartId: cart.id,
                lineItems,
                status: 'pending'
            };

            console.log('Minimal purchase data to save:', purchaseData);
            // Example: await saveMinimalPurchaseToDatabase(purchaseData);

        } catch (dbError) {
            console.error('Failed to save minimal purchase data:', dbError);
            // Continue with checkout even if DB save fails
        }

        // Add return URL parameters to the checkout URL
        const checkoutUrl = new URL(cart.checkoutUrl);
        if (process.env.NEXT_PUBLIC_SITE_URL) {
            checkoutUrl.searchParams.set('return_to', `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you`);
        }

        return NextResponse.json({
            webUrl: checkoutUrl.toString(),
            cartId: cart.id,
            totalQuantity: cart.totalQuantity,
            cost: cart.cost
        });

    } catch (err: any) {
        console.error('API checkout error:', err);
        return NextResponse.json(
            { error: err?.message || 'Server error' },
            { status: 500 }
        );
    }
}