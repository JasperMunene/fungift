'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categories = [
  { name: 'Shopping', count: 45, stores: ['Amazon', 'Target', 'Walmart', 'Best Buy'] },
  { name: 'Food & Dining', count: 32, stores: ['Starbucks', 'McDonald\'s', 'DoorDash', 'Uber Eats'] },
  { name: 'Entertainment', count: 28, stores: ['Netflix', 'Spotify', 'iTunes', 'Steam'] },
  { name: 'Fashion & Beauty', count: 24, stores: ['Sephora', 'Nike', 'H&M', 'Zara'] },
  { name: 'Travel & Experience', count: 19, stores: ['Airbnb', 'Booking.com', 'Expedia'] },
  { name: 'Gaming', count: 15, stores: ['PlayStation', 'Xbox', 'Nintendo', 'Steam'] },
  { name: 'Health & Wellness', count: 12, stores: ['CVS', 'Walgreens', 'GNC'] },
];

const amounts = [10, 25, 50, 100, 250, 500];

const occasions = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Graduation',
  'Thank You',
  'Congratulations',
  'Get Well Soon',
  'New Job',
  'Retirement',
  'Just Because',
];

export function GiftCardFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAmounts, setSelectedAmounts] = useState<number[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleAmount = (amount: number) => {
    setSelectedAmounts(prev =>
      prev.includes(amount)
        ? prev.filter(a => a !== amount)
        : [...prev, amount]
    );
  };

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions(prev =>
      prev.includes(occasion)
        ? prev.filter(o => o !== occasion)
        : [...prev, occasion]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedAmounts([]);
    setSelectedOccasions([]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedAmounts.length > 0 || 
                          selectedOccasions.length > 0;

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
              {selectedAmounts.map(amount => (
                <Badge key={amount} variant="secondary" className="cursor-pointer" onClick={() => toggleAmount(amount)}>
                  ${amount} ×
                </Badge>
              ))}
              {selectedOccasions.map(occasion => (
                <Badge key={occasion} variant="secondary" className="cursor-pointer" onClick={() => toggleOccasion(occasion)}>
                  {occasion} ×
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Amounts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Amount Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {amounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmounts.includes(amount) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleAmount(amount)}
                className="text-sm"
              >
                ${amount}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={category.name}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => toggleCategory(category.name)}
                    />
                    <label htmlFor={category.name} className="text-sm font-medium cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">({category.count})</span>
                </div>
                <div className="ml-6 flex flex-wrap gap-1">
                  {category.stores.slice(0, 3).map((store) => (
                    <Badge key={store} variant="outline" className="text-xs">
                      {store}
                    </Badge>
                  ))}
                  {category.stores.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{category.stores.length - 3} more
                    </Badge>
                  )}
                </div>
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
                  id={`occasion-${occasion}`}
                  checked={selectedOccasions.includes(occasion)}
                  onCheckedChange={() => toggleOccasion(occasion)}
                />
                <label htmlFor={`occasion-${occasion}`} className="text-sm cursor-pointer">
                  {occasion}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gift Card Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="instant-delivery" defaultChecked disabled />
              <label htmlFor="instant-delivery" className="text-sm text-gray-600">
                Instant Delivery
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="custom-message" defaultChecked disabled />
              <label htmlFor="custom-message" className="text-sm text-gray-600">
                Custom Message
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="never-expires" defaultChecked disabled />
              <label htmlFor="never-expires" className="text-sm text-gray-600">
                Never Expires
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}