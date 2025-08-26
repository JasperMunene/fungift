'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const categories = [
  { name: 'Electronics', count: 145 },
  { name: 'Home & Living', count: 298 },
  { name: 'Fashion & Accessories', count: 167 },
  { name: 'Food & Beverages', count: 89 },
  { name: 'Books & Media', count: 234 },
  { name: 'Health & Beauty', count: 156 },
  { name: 'Sports & Outdoors', count: 123 },
  { name: 'Toys & Games', count: 198 },
];

const occasions = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Graduation',
  'Mother\'s Day',
  'Father\'s Day',
  'Valentine\'s Day',
  'Christmas',
  'Housewarming',
  'Baby Shower',
];

const brands = [
  'Apple',
  'Samsung',
  'Sony',
  'Nike',
  'Adidas',
  'Canon',
  'KitchenAid',
  'Dyson',
];

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions(prev =>
      prev.includes(occasion)
        ? prev.filter(o => o !== occasion)
        : [...prev, occasion]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([0, 500]);
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setSelectedBrands([]);
    setSelectedRating(null);
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedOccasions.length > 0 || 
                          selectedBrands.length > 0 || 
                          selectedRating !== null ||
                          priceRange[0] > 0 || priceRange[1] < 500;

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm">Active Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(category => (
                <Badge key={category} variant="secondary" className="cursor-pointer" onClick={() => toggleCategory(category)}>
                  {category} ×
                </Badge>
              ))}
              {selectedOccasions.map(occasion => (
                <Badge key={occasion} variant="secondary" className="cursor-pointer" onClick={() => toggleOccasion(occasion)}>
                  {occasion} ×
                </Badge>
              ))}
              {selectedBrands.map(brand => (
                <Badge key={brand} variant="secondary" className="cursor-pointer" onClick={() => toggleBrand(brand)}>
                  {brand} ×
                </Badge>
              ))}
              {selectedRating && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedRating(null)}>
                  {selectedRating}+ Stars ×
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={500}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.name}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => toggleCategory(category.name)}
                  />
                  <label htmlFor={category.name} className="text-sm cursor-pointer">
                    {category.name}
                  </label>
                </div>
                <span className="text-xs text-gray-500">({category.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Customer Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={selectedRating === rating}
                  onCheckedChange={() => setSelectedRating(selectedRating === rating ? null : rating)}
                />
                <label htmlFor={`rating-${rating}`} className="flex items-center cursor-pointer">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">& Up</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Occasions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Perfect For</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {occasions.map((occasion) => (
              <div key={occasion} className="flex items-center space-x-2">
                <Checkbox
                  id={occasion}
                  checked={selectedOccasions.includes(occasion)}
                  onCheckedChange={() => toggleOccasion(occasion)}
                />
                <label htmlFor={occasion} className="text-sm cursor-pointer">
                  {occasion}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Popular Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                />
                <label htmlFor={brand} className="text-sm cursor-pointer">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}