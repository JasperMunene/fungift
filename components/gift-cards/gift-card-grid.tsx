'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingUp, Clock, Mail } from 'lucide-react';
import { useApp } from '@/components/providers';
import { GiftCardCustomizer } from './gift-card-customizer';

interface GiftCard {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  logo?: string;
  amounts: number[];
  popular?: boolean;
  featured?: boolean;
  termsUrl?: string;
}

const allGiftCards: GiftCard[] = [
  {
    id: 'gc-amazon',
    name: 'Amazon Gift Card',
    description: 'Shop millions of items on Amazon',
    category: 'Shopping',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg',
    amounts: [25, 50, 100, 200, 500],
    popular: true,
    featured: true,
  },
  {
    id: 'gc-starbucks',
    name: 'Starbucks Gift Card',
    description: 'Perfect for coffee lovers',
    category: 'Food & Dining',
    image: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg',
    amounts: [10, 25, 50, 100],
    popular: true,
  },
  {
    id: 'gc-netflix',
    name: 'Netflix Gift Card',
    description: 'Stream your favorite shows and movies',
    category: 'Entertainment',
    image: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg',
    amounts: [15, 30, 60, 100],
    featured: true,
  },
  {
    id: 'gc-spotify',
    name: 'Spotify Gift Card',
    description: 'Unlimited music streaming',
    category: 'Entertainment',
    image: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg',
    amounts: [10, 30, 60],
  },
  {
    id: 'gc-apple',
    name: 'Apple App Store & iTunes',
    description: 'Apps, games, music, and more',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/1036641/pexels-photo-1036641.jpeg',
    amounts: [25, 50, 100, 200],
  },
  {
    id: 'gc-target',
    name: 'Target Gift Card',
    description: 'Everything you need in one place',
    category: 'Shopping',
    image: 'https://images.pexels.com/photos/5632401/pexels-photo-5632401.jpeg',
    amounts: [25, 50, 100, 200],
    popular: true,
  },
  {
    id: 'gc-sephora',
    name: 'Sephora Gift Card',
    description: 'Beauty and cosmetics',
    category: 'Fashion & Beauty',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg',
    amounts: [25, 50, 100, 250],
  },
  {
    id: 'gc-doordash',
    name: 'DoorDash Gift Card',
    description: 'Food delivery from local restaurants',
    category: 'Food & Dining',
    image: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg',
    amounts: [25, 50, 100],
  },
  {
    id: 'gc-steam',
    name: 'Steam Wallet Gift Card',
    description: 'Gaming platform for PC gamers',
    category: 'Gaming',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    amounts: [20, 50, 100],
  },
];

interface GiftCardGridProps {
  sortBy: string;
}

export function GiftCardGrid({ sortBy }: GiftCardGridProps) {
  const { addToCart } = useApp();
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const sortCards = (cards: GiftCard[]) => {
    switch (sortBy) {
      case 'name':
        return [...cards].sort((a, b) => a.name.localeCompare(b.name));
      case 'category':
        return [...cards].sort((a, b) => a.category.localeCompare(b.category));
      default:
        return [...cards].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return 0;
        });
    }
  };

  const sortedCards = sortCards(allGiftCards);
  const totalPages = Math.ceil(sortedCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = sortedCards.slice(startIndex, startIndex + cardsPerPage);

  const handleQuickAdd = (giftCard: GiftCard, amount: number) => {
    addToCart({
      name: `${giftCard.name} - $${amount}`,
      price: amount,
      type: 'gift-card',
      image: giftCard.image,
      amount,
      design: 'default',
    });
  };

  return (
    <div>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + cardsPerPage, sortedCards.length)} of {sortedCards.length} gift cards
        </p>
      </div>

      {/* Featured Cards */}
      {currentPage === 1 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Gift Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCards.filter(card => card.featured).slice(0, 3).map((giftCard) => (
              <Card key={giftCard.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-blue-50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={giftCard.image}
                    alt={giftCard.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-xl mb-1">{giftCard.name}</h3>
                    <p className="text-sm opacity-90">{giftCard.description}</p>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {giftCard.amounts.slice(0, 4).map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAdd(giftCard, amount)}
                        className="hover:bg-emerald-50 hover:border-emerald-300"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-emerald-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Instant
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedCard(giftCard)}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    >
                      Customize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Gift Cards */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Gift Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCards.map((giftCard) => (
            <Card key={giftCard.id} className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={giftCard.image}
                  alt={giftCard.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="text-xs">{giftCard.category}</Badge>
                  {giftCard.popular && (
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-lg mb-1">{giftCard.name}</h3>
                  <p className="text-sm opacity-90">{giftCard.description}</p>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {giftCard.amounts.slice(0, 4).map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd(giftCard, amount)}
                      className="hover:bg-emerald-50 hover:border-emerald-300"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-emerald-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Instant
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setSelectedCard(giftCard)}>
                    Customize
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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

      {/* Gift Card Customizer Modal */}
      {selectedCard && (
        <GiftCardCustomizer
          giftCard={selectedCard}
          open={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}