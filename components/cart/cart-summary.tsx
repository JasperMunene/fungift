'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useApp } from '@/components/providers';
import { ShoppingBag, Tag, Shield, Truck } from 'lucide-react';

export function CartSummary() {
  const { cart } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const hasPhysicalProducts = cart.some(item => item.type === 'product');
  const shippingCost = hasPhysicalProducts ? (subtotal >= 50 ? 0 : 8.99) : 0;
  const tax = (subtotal - promoDiscount) * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax - promoDiscount;

  const handleApplyPromo = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === 'save10') {
      setAppliedPromo(promoCode);
      setPromoDiscount(subtotal * 0.1);
    } else if (promoCode.toLowerCase() === 'freeship') {
      setAppliedPromo(promoCode);
      setPromoDiscount(shippingCost);
    } else {
      // Invalid promo code
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode('');
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          {/* Shipping */}
          {hasPhysicalProducts && (
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span>Shipping</span>
                {shippingCost === 0 && (
                  <Badge variant="secondary" className="text-xs">Free</Badge>
                )}
              </div>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
          )}
          
          {/* Promo Discount */}
          {appliedPromo && (
            <div className="flex justify-between text-emerald-600">
              <div className="flex items-center gap-2">
                <span>Promo ({appliedPromo})</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removePromo}
                  className="h-auto p-0 text-xs text-gray-500 hover:text-red-600"
                >
                  Remove
                </Button>
              </div>
              <span>-${promoDiscount.toFixed(2)}</span>
            </div>
          )}
          
          {/* Tax */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Estimated tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          {/* Total */}
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Promo Code
          </h3>
          
          {!appliedPromo ? (
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={handleApplyPromo}
                disabled={!promoCode.trim()}
              >
                Apply
              </Button>
            </div>
          ) : (
            <div className="bg-emerald-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-emerald-900">Promo Applied!</div>
                  <div className="text-sm text-emerald-700">Code: {appliedPromo}</div>
                </div>
                <Badge className="bg-emerald-500">
                  -${promoDiscount.toFixed(2)}
                </Badge>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            <div>Try these codes:</div>
            <div>• SAVE10 - 10% off your order</div>
            <div>• FREESHIP - Free shipping</div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Button */}
      <Card>
        <CardContent className="p-6">
          <Link href="/checkout">
            <Button size="lg" className="w-full mb-4">
              Proceed to Checkout
              <span className="ml-2">${total.toFixed(2)}</span>
            </Button>
          </Link>
          
          {/* Security & Shipping Info */}
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Secure 256-bit SSL encryption</span>
            </div>
            
            {hasPhysicalProducts && (
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Free shipping on orders over $50</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Accepted Payment Methods */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">We Accept</h3>
          <div className="grid grid-cols-4 gap-2">
            {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
              <div key={method} className="bg-gray-100 rounded p-2 text-center text-xs font-medium">
                {method}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}