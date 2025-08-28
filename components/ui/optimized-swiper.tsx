'use client'

import React, { Suspense, lazy } from 'react'
import { SwiperProps } from 'swiper/react'

// Lazy load Swiper components for better performance
const Swiper = lazy(() => import('swiper/react').then(module => ({ default: module.Swiper })))
const SwiperSlide = lazy(() => import('swiper/react').then(module => ({ default: module.SwiperSlide })))

interface OptimizedSwiperProps extends SwiperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const SwiperFallback = () => (
  <div className="flex gap-4 overflow-x-auto pb-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex-shrink-0 w-64 h-80 bg-gray-200 animate-pulse rounded-2xl"></div>
    ))}
  </div>
)

const OptimizedSwiper: React.FC<OptimizedSwiperProps> = ({ 
  children, 
  fallback = <SwiperFallback />,
  ...props 
}) => {
  return (
    <Suspense fallback={fallback}>
      <Swiper {...props}>
        {children}
      </Swiper>
    </Suspense>
  )
}

const OptimizedSwiperSlide: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <Suspense fallback={<div className="w-full h-full bg-gray-200 animate-pulse rounded-2xl"></div>}>
      <SwiperSlide className={className}>
        {children}
      </SwiperSlide>
    </Suspense>
  )
}

export { OptimizedSwiper, OptimizedSwiperSlide }
export default OptimizedSwiper
