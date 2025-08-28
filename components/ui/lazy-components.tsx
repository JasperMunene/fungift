'use client'

import dynamic from 'next/dynamic'
import { SectionSkeleton } from './loading-skeleton'

// Lazy load non-critical components for better performance
export const LazyWhyChooseUs = dynamic(() => import('@/components/WhyChooseUs/WhyChooseUs'), {
  loading: () => <SectionSkeleton title="Why Choose Us" productCount={0} />,
  ssr: false
})

export const LazyFooter = dynamic(() => import('@/components/layout/footer'), {
  loading: () => (
    <div className="bg-surface h-32 animate-pulse">
      <div className="container h-full flex items-center justify-center">
        <div className="text-gray-400">Loading footer...</div>
      </div>
    </div>
  ),
  ssr: false
})

// Lazy load Benefit component with intersection observer for better performance
export const LazyBenefit = dynamic(() => import('@/components/Benefit/Benefit'), {
  loading: () => <SectionSkeleton title="Benefits" productCount={0} />,
  ssr: true // Keep SSR for above-the-fold content
})

export default {
  LazyWhyChooseUs,
  LazyFooter,
  LazyBenefit
}
