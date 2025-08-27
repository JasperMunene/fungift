// app/api/checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { lineItems } = body; // Only need lineItems now

        if (!Array.isArray(lineItems) || lineItems.length === 0) {
            return NextResponse.json({ error: 'lineItems required' }, { status: 400 });
        }

        const query = `
            mutation cartCreate($input: CartInput!) {
                cartCreate(input: $input) {
                    cart {
                        id
                        checkoutUrl
                        lines(first: 10) {
                            edges {
                                node {
                                    id
                                    quantity
                                    merchandise {
                                        ... on ProductVariant {
                                            id
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
        console.log('Full Shopify response:', JSON.stringify(result, null, 2));

        const cart = result.data?.cartCreate?.cart;
        const errors = result.data?.cartCreate?.userErrors || [];

        if (errors.length > 0) {
            console.error('Shopify cart errors:', errors);
            return NextResponse.json(
                { error: errors.map((e: any) => e.message).join(', ') },
                { status: 400 }
            );
        }

        if (!cart?.checkoutUrl) {
            throw new Error('No checkout URL returned from Shopify');
        }

        // Store minimal purchase information in your database
        try {
            const purchaseData = {
                cartId: cart.id,
                lineItems,
                status: 'pending'
            };

            // Save to your database - just the cart ID and line items
            console.log('Minimal purchase data to save:', purchaseData);

            // Example: await saveMinimalPurchaseToDatabase(purchaseData);

        } catch (dbError) {
            console.error('Failed to save minimal purchase data:', dbError);
            // Continue with checkout even if DB save fails
        }

        // Add return URL parameters to the checkout URL
        const checkoutUrl = new URL(cart.checkoutUrl);
        checkoutUrl.searchParams.set('return_to', `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you`);

        return NextResponse.json({
            webUrl: checkoutUrl.toString(),
            cartId: cart.id
        });

    } catch (err: any) {
        console.error('API checkout error', err);
        return NextResponse.json(
            { error: err?.message || 'Server error' },
            { status: 500 }
        );
    }
}