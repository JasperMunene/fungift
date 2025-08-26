'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { GiftCardGrid } from '@/components/gift-cards/gift-card-grid';
import { GiftCardFilters } from '@/components/gift-cards/gift-card-filters';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';
import MenuSearch from "@/components/Header/Menu/MenuSearch";

export default function GiftCardsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuSearch props="bg-white" />
      <main>
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Digital Gift Cards</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Instant delivery, endless possibilities. Send the perfect gift card to anyone, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-semibold text-emerald-600">✨ Instant Delivery</div>
                  <div className="text-sm text-gray-600">Delivered within minutes</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-semibold text-blue-600">🎁 Custom Messages</div>
                  <div className="text-sm text-gray-600">Personalize your gift</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-semibold text-purple-600">🔒 Secure & Safe</div>
                  <div className="text-sm text-gray-600">100% guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                  <SelectItem value="category">By Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <GiftCardFilters />
            </div>
            
            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black/50 z-50">
                <div className="bg-white w-80 h-full overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                      ×
                    </Button>
                  </div>
                  <GiftCardFilters />
                </div>
              </div>
            )}
            
            {/* Gift Cards */}
            <div className="flex-1">
              <GiftCardGrid sortBy={sortBy} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}