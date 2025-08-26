import { Shield, Truck, Clock, Heart, Gift, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Your payment information is always protected with bank-level security.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over $50. Express options available.',
  },
  {
    icon: Clock,
    title: 'Instant Gift Cards',
    description: 'Digital gift cards delivered immediately to any email address.',
  },
  {
    icon: Heart,
    title: 'Curated Selection',
    description: 'Every product is handpicked by our team of gift experts.',
  },
  {
    icon: Gift,
    title: 'Gift Wrapping',
    description: 'Beautiful packaging available for all physical items.',
  },
  {
    icon: Sparkles,
    title: '24/7 Support',
    description: 'Our customer service team is always here to help.',
  },
];

export function Features() {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose GiftHub?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make gift-giving effortless with premium products and exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}