'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useApp } from '@/components/providers';

const products = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199,
    originalPrice: 249,
    image: 'https://images.pexels.com/photos/3945681/pexels-photo-3945681.jpeg',
    rating: 4.8,
    reviews: 324,
    category: 'Electronics',
    isNew: true,
  },
  {
    id: '2',
    name: 'Artisan Coffee Gift Set',
    price: 89,
    image: 'https://images.pexels.com/photos/2631613/pexels-photo-2631613.jpeg',
    rating: 4.9,
    reviews: 156,
    category: 'Food & Drink',
    isBestseller: true,
  },
  {
    id: '3',
    name: 'Luxury Scented Candle Set',
    price: 75,
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
    rating: 4.7,
    reviews: 89,
    category: 'Home & Living',
  },
  {
    id: '4',
    name: 'Smart Fitness Tracker',
    price: 149,
    originalPrice: 199,
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg',
    rating: 4.6,
    reviews: 267,
    category: 'Health & Fitness',
  },
  {
    id: '5',
    name: 'Designer Silk Scarf',
    price: 120,
    image: 'https://images.pexels.com/photos/6764038/pexels-photo-6764038.jpeg',
    rating: 4.8,
    reviews: 45,
    category: 'Fashion',
    isNew: true,
  },
  {
    id: '6',
    name: 'Gourmet Chocolate Collection',
    price: 95,
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    rating: 4.9,
    reviews: 234,
    category: 'Food & Drink',
    isBestseller: true,
  },
];

export function PopularProducts() {
  const { addToCart, toggleWishlist, wishlist } = useApp();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      name: product.name,
      price: product.price,
      type: 'product',
      image: product.image,
      category: product.category,
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Physical Gifts</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked items that make perfect gifts for your loved ones
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">New</Badge>
                  )}
                  {product.isBestseller && (
                    <Badge className="bg-orange-500 hover:bg-orange-600">Bestseller</Badge>
                  )}
                  {product.originalPrice && (
                    <Badge variant="destructive">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      wishlist.includes(product.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-600'
                    }`} 
                  />
                </Button>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    className="group-hover:bg-emerald-600"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}