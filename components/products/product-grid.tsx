'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useApp } from '@/components/providers';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  brand: string;
  description: string;
  isNew?: boolean;
  isBestseller?: boolean;
  inStock: boolean;
}

const allProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199,
    originalPrice: 249,
    image: 'https://images.pexels.com/photos/3945681/pexels-photo-3945681.jpeg',
    rating: 4.8,
    reviews: 324,
    category: 'Electronics',
    brand: 'Sony',
    description: 'High-quality wireless headphones with noise cancellation',
    isNew: true,
    inStock: true,
  },
  {
    id: '2',
    name: 'Artisan Coffee Gift Set',
    price: 89,
    image: 'https://images.pexels.com/photos/2631613/pexels-photo-2631613.jpeg',
    rating: 4.9,
    reviews: 156,
    category: 'Food & Beverages',
    brand: 'Local Roasters',
    description: 'Premium coffee collection with artisan blends',
    isBestseller: true,
    inStock: true,
  },
  {
    id: '3',
    name: 'Luxury Scented Candle Set',
    price: 75,
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
    rating: 4.7,
    reviews: 89,
    category: 'Home & Living',
    brand: 'Aromatherapy Co.',
    description: 'Hand-poured candles with natural essential oils',
    inStock: true,
  },
  {
    id: '4',
    name: 'Smart Fitness Tracker',
    price: 149,
    originalPrice: 199,
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg',
    rating: 4.6,
    reviews: 267,
    category: 'Electronics',
    brand: 'FitTech',
    description: 'Advanced fitness tracking with heart rate monitoring',
    inStock: true,
  },
  {
    id: '5',
    name: 'Designer Silk Scarf',
    price: 120,
    image: 'https://images.pexels.com/photos/6764038/pexels-photo-6764038.jpeg',
    rating: 4.8,
    reviews: 45,
    category: 'Fashion & Accessories',
    brand: 'Luxury Fashion',
    description: 'Elegant silk scarf with unique pattern design',
    isNew: true,
    inStock: true,
  },
  {
    id: '6',
    name: 'Gourmet Chocolate Collection',
    price: 95,
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    rating: 4.9,
    reviews: 234,
    category: 'Food & Beverages',
    brand: 'Chocolatier',
    description: 'Handcrafted chocolates with exotic flavors',
    isBestseller: true,
    inStock: true,
  },
  {
    id: '7',
    name: 'Portable Bluetooth Speaker',
    price: 79,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
    rating: 4.5,
    reviews: 189,
    category: 'Electronics',
    brand: 'SoundWave',
    description: 'Compact speaker with powerful bass',
    inStock: true,
  },
  {
    id: '8',
    name: 'Organic Skincare Set',
    price: 125,
    image: 'https://images.pexels.com/photos/7578562/pexels-photo-7578562.jpeg',
    rating: 4.7,
    reviews: 98,
    category: 'Health & Beauty',
    brand: 'Natural Beauty',
    description: 'Complete skincare routine with natural ingredients',
    inStock: true,
  },
  {
    id: '9',
    name: 'Professional Chef Knife',
    price: 160,
    image: 'https://images.pexels.com/photos/4226879/pexels-photo-4226879.jpeg',
    rating: 4.8,
    reviews: 156,
    category: 'Home & Living',
    brand: 'Chef Masters',
    description: 'High-carbon steel knife for professional cooking',
    inStock: false,
  },
];

interface ProductGridProps {
  viewMode: 'grid' | 'list';
  sortBy: string;
}

export function ProductGrid({ viewMode, sortBy }: ProductGridProps) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const sortProducts = (products: Product[]) => {
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...products].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default:
        return [...products].sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  };

  const sortedProducts = sortProducts(allProducts);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) return;
    
    addToCart({
      name: product.name,
      price: product.price,
      type: 'product',
      image: product.image,
      category: product.category,
    });
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300">
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
          {!product.inStock && (
            <Badge variant="secondary" className="bg-gray-500">Out of Stock</Badge>
          )}
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white"
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
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">{product.category}</Badge>
          <span className="text-xs text-gray-500">by {product.brand}</span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-900">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
        </div>
        
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
            disabled={!product.inStock}
            className="group-hover:bg-emerald-600"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex">
        <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">New</Badge>
            )}
            {product.isBestseller && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">Bestseller</Badge>
            )}
          </div>
        </div>
        
        <CardContent className="flex-1 p-6">
          <div className="flex justify-between h-full">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                <span className="text-xs text-gray-500">by {product.brand}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {product.name}
              </h3>
              
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="flex items-center gap-1 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end justify-between ml-6">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
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
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
                
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className="w-full"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, sortedProducts.length)} of {sortedProducts.length} products
        </p>
      </div>

      {/* Products */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {currentProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              onClick={() => setCurrentPage(i + 1)}
              className="w-10"
            >
              {i + 1}
            </Button>
          ))}
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}