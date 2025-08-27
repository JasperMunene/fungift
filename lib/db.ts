// lib/db.ts
import { prisma } from './prisma'

export async function createCustomer(customerData: any) {
    try {
        // Use upsert to handle both create and update scenarios
        const customer = await prisma.customer.upsert({
            where: { email: customerData.email },
            update: {
                name: customerData.name,
                // Add other fields you might want to update
            },
            create: {
                id: customerData.id,
                name: customerData.name,
                email: customerData.email,
            },
        })

        return customer
    } catch (error) {
        console.error('Error creating/updating customer:', error)
        throw error
    }
}

export async function createPurchaseRecord(purchaseData: any) {
    try {
        const purchase = await prisma.purchase.create({
            data: {
                customerId: purchaseData.customerId,
                amount: purchaseData.amount,
                currency: purchaseData.currency,
                paymentStatus: purchaseData.paymentStatus,
                paymentProvider: purchaseData.paymentProvider,
                paymentReference: purchaseData.paymentReference,
                paidAt: purchaseData.paidAt,
            },
        })

        return purchase
    } catch (error) {
        console.error('Error creating purchase record:', error)
        throw error
    }
}


export async function createGiftCardsForPurchase(purchaseId: string, lineItems: any[], recipientEmail: string) {
    try {
        for (const item of lineItems) {
            if (isGiftCardProduct(item)) {
                const giftCardPromises = []

                for (let i = 0; i < item.quantity; i++) {
                    const giftCardCode = generateGiftCardCode()

                    giftCardPromises.push(
                        prisma.giftCard.create({
                            data: {
                                code: giftCardCode,
                                amount: item.price,
                                currency: 'USD',
                                status: 'ACTIVE', // Enum values must match Prisma enum casing
                                recipientEmail: recipientEmail,
                                purchaseId: purchaseId,
                            },
                        })
                    )

                }

                // Create all gift cards for this line item
                const giftCards = await Promise.all(giftCardPromises)

                // Send emails (you might want to handle this in a background job)
                for (const giftCard of giftCards) {
                    await sendGiftCardEmail(
                        giftCard.recipientEmail,
                        giftCard.code,
                        giftCard.amount.toNumber()
                    )

                }
            }
        }
    } catch (error) {
        console.error('Error creating gift cards:', error)
        throw error
    }
}

// Utility functions
function isGiftCardProduct(item: any): boolean {
    return item.product_id === process.env.GIFT_CARD_PRODUCT_ID ||
        item.sku?.startsWith('GIFT-') ||
        item.tags?.includes('gift-card')
}

function generateGiftCardCode(): string {
    return 'GIFT-' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

async function sendGiftCardEmail(email: string, code: string, amount: number) {
    // Implement your email sending logic here
    console.log(`Sending gift card email to ${email} with code ${code} and amount ${amount}`)
    // You might use Nodemailer, SendGrid, or another email service
}