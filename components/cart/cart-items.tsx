'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, Gift, CreditCard, Heart } from 'lucide-react';
import { useApp } from '@/components/providers';

export function CartItems() {
  const { cart, removeFromCart, updateCartQuantity, toggleWishlist } = useApp();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartQuantity(id, newQuantity);
    }
  };

  const moveToWishlist = (item: any) => {
    toggleWishlist(item.name); // Using name as ID for wishlist
    removeFromCart(item.id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Cart Items ({cart.length} item{cart.length !== 1 ? 's' : ''})
          </h2>
          
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0">
                {/* Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1">
                    {item.type === 'gift-card' ? (
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Gift className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={item.type === 'gift-card' ? 'default' : 'secondary'} className="text-xs">
                          {item.type === 'gift-card' ? 'Digital' : 'Physical'}
                        </Badge>
                        {item.category && (
                          <span className="text-xs text-gray-500">{item.category}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${item.price}</div>
                      <div className="text-sm text-gray-500">each</div>
                    </div>
                  </div>
                  
                  {/* Gift Card Details */}
                  {item.type === 'gift-card' && (
                    <div className="text-sm text-gray-600 mb-2">
                      <div>Amount: ${item.amount}</div>
                      {item.design && <div>Design: {item.design}</div>}
                      {item.recipientEmail && <div>To: {item.recipientEmail}</div>}
                    </div>
                  )}
                  
                  {/* Quantity Controls and Actions */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity for physical products */}
                    {item.type === 'product' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="h-8 w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-500 ml-2">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    {/* Gift card quantity is always 1 */}
                    {item.type === 'gift-card' && (
                      <div className="text-sm text-gray-600">
                        Quantity: 1 (Digital Delivery)
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveToWishlist(item)}
                        className="text-gray-500 hover:text-emerald-600"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Delivery Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Information</h3>
          <div className="space-y-3 text-sm">
            {cart.some(item => item.type === 'gift-card') && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-blue-900">Digital Gift Cards</div>
                  <div className="text-blue-700">Delivered instantly via email</div>
                </div>
              </div>
            )}
            
            {cart.some(item => item.type === 'product') && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <Gift className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-emerald-900">Physical Products</div>
                  <div className="text-emerald-700">Free shipping on orders over $50</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}