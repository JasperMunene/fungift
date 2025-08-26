'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift, CreditCard } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            The Perfect Gift for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 block">
              Every Occasion
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover thousands of unique gifts and instant digital gift cards. From birthdays to holidays, 
            we have everything you need to make someone smile.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3 group">
                <Gift className="mr-2 w-5 h-5 group-hover:animate-pulse" />
                Shop Physical Gifts
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/gift-cards">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-3 group border-emerald-200 hover:border-emerald-300">
                <CreditCard className="mr-2 w-5 h-5 group-hover:animate-pulse" />
                Buy Gift Cards
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Gift Options</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
    </section>
  );
}