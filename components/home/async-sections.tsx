'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { SectionSkeleton } from '@/components/ui/loading-skeleton'
import ErrorBoundary from '@/components/ui/error-boundary'

// Dynamic imports for code splitting
const BestSellerClient = dynamic(() => import('@/components/BestSeller/BestSeller'), {
  loading: () => <SectionSkeleton title="Best Sellers" productCount={4} />,
  ssr: false
})

const TrendingGiftCardsClient = dynamic(() => import('@/components/home/trending-gift-cards'), {
  loading: () => <SectionSkeleton title="Gift Cards" productCount={4} />,
  ssr: false
})

interface AsyncSectionsProps {
  bestSellersProps?: {
    collectionHandle?: string
    limit?: number
  }
  giftCardsProps?: {
    collectionHandle?: string
    limit?: number
  }
}

const AsyncSections: React.FC<AsyncSectionsProps> = ({
  bestSellersProps = { collectionHandle: 'best-sellers', limit: 8 },
  giftCardsProps = { collectionHandle: 'gift-cards', limit: 8 }
}) => {
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton title="Best Sellers" productCount={4} />}>
          <BestSellerClient {...bestSellersProps} />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton title="Gift Cards" productCount={4} />}>
          <TrendingGiftCardsClient {...giftCardsProps} />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default AsyncSections
