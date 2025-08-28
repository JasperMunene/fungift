'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { CartItems } from '@/components/cart/cart-items';
import { CartSummary } from '@/components/cart/cart-summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/components/providers';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during SSR/build
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded mb-8 animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  try {
    const { cart } = useApp();

    if (cart.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/product">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Physical Gifts
                  </Button>
                </Link>
                <Link href="/gift-cards">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Browse Gift Cards
                  </Button>
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">Review your items and proceed to checkout</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <CartItems />
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>

          {/* Continue Shopping Suggestions */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Premium Gift Wrapping',
                  price: 9.99,
                  image: 'https://images.pexels.com/photos/264502/pexels-photo-264502.jpeg',
                  description: 'Beautiful wrapping for your gifts',
                },
                {
                  name: 'Greeting Card',
                  price: 4.99,
                  image: 'https://images.pexels.com/photos/6292711/pexels-photo-6292711.jpeg',
                  description: 'Add a personal touch with a card',
                },
                {
                  name: 'Express Shipping',
                  price: 15.99,
                  image: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg',
                  description: 'Get your gifts delivered faster',
                },
              ].map((item, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">${item.price}</span>
                      <Button size="sm" variant="outline">Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    // Fallback for when context is not available
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/product">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Physical Gifts
                </Button>
              </Link>
              <Link href="/gift-cards">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Gift Cards
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}