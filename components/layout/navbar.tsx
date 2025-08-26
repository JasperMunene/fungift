'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/components/providers';
import { AuthDialog } from '@/components/auth/auth-dialog';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user, cart, wishlist } = useApp();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GH</span>
            </div>
            <span className="font-bold text-xl text-gray-900">GiftHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/gift-cards" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
              Gift Cards
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
              Products
            </Link>
            <Link href="/occasions" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
              Occasions
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search gifts and gift cards..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 text-xs p-0 flex items-center justify-center">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 text-xs p-0 flex items-center justify-center">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User */}
            {user ? (
              <Link href="/account">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowAuthDialog(true)}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search gifts and gift cards..."
                className="pl-10 w-full"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/gift-cards" className="text-gray-700 hover:text-emerald-600 font-medium">
                Gift Cards
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-emerald-600 font-medium">
                Products
              </Link>
              <Link href="/occasions" className="text-gray-700 hover:text-emerald-600 font-medium">
                Occasions
              </Link>
              {!user && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => setShowAuthDialog(true)}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </nav>
  );
}