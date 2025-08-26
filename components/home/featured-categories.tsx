import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Heart, Cake, Home, Baby, Gamepad2, Sparkles } from 'lucide-react';

const categories = [
  {
    name: 'Birthday Gifts',
    icon: Cake,
    count: '150+ items',
    href: '/occasions/birthday',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
  },
  {
    name: 'Wedding & Anniversary',
    icon: Heart,
    count: '200+ items',
    href: '/occasions/wedding',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
  },
  {
    name: 'Home & Living',
    icon: Home,
    count: '300+ items',
    href: '/categories/home',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
  },
  {
    name: 'Baby & Kids',
    icon: Baby,
    count: '180+ items',
    href: '/categories/baby',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
  },
  {
    name: 'Gaming & Tech',
    icon: Gamepad2,
    count: '120+ items',
    href: '/categories/tech',
    color: 'from-blue-500 to-purple-500',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Luxury Items',
    icon: Sparkles,
    count: '80+ items',
    href: '/categories/luxury',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect gift for any occasion with our carefully curated categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.name} href={category.href} className="group">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl ${category.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                          {category.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}