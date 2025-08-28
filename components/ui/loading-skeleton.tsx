import React from 'react'

interface ProductSkeletonProps {
  count?: number
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 aspect-[3/4] rounded-2xl mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface SectionSkeletonProps {
  title?: string
  productCount?: number
}

export const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ 
  title = "Loading...", 
  productCount = 4 
}) => {
  return (
    <div className="section-padding">
      <div className="container">
        <div className="text-center mb-8">
          <div className="heading3 text-gray-400">{title}</div>
        </div>
        <ProductSkeleton count={productCount} />
      </div>
    </div>
  )
}

export default SectionSkeleton
