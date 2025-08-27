// app/api/webhooks/shopify/route.ts
import { NextResponse } from 'next/server';
import { createCustomer, createPurchaseRecord, createGiftCardsForPurchase } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Webhook received:', JSON.stringify(body, null, 2));

        const { id, customer, line_items, total_price, financial_status, currency } = body;

        if (financial_status === 'paid') {
            // Create or update customer in your database
            let customerRecord = null;
            if (customer) {
                customerRecord = await createCustomer({
                    id: customer.id,
                    name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
                    email: customer.email
                });
            }

            // Create purchase record with customer details
            const purchaseRecord = await createPurchaseRecord({
                customerId: customerRecord?.id || null,
                amount: total_price,
                currency: currency,
                paymentStatus: 'paid',
                paymentProvider: 'shopify',
                paymentReference: id,
                paidAt: new Date()
            });

            // Create gift cards for the purchase
            if (line_items && line_items.length > 0) {
                await createGiftCardsForPurchase(
                    purchaseRecord.id,
                    line_items,
                    customer?.email
                );
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Webhook error', err);
        return NextResponse.json(
            { error: err?.message || 'Server error' },
            { status: 500 }
        );
    }
}