import React from 'react';

interface ProductSkeletonProps {
  count?: number;
  className?: string;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 4, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Image skeleton */}
          <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
          
          {/* Title skeleton */}
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          
          {/* Price skeleton */}
          <div className="bg-gray-200 h-4 rounded w-1/2 mb-2"></div>
          
          {/* Rating skeleton */}
          <div className="flex items-center space-x-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-3 w-3 rounded"></div>
            ))}
          </div>
          
          {/* Button skeleton */}
          <div className="bg-gray-200 h-8 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;

