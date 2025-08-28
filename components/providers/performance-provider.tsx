'use client'

import { useEffect } from 'react'
import { preloadCriticalResources, trackWebVitals } from '@/lib/performance'
import { reportWebVitals, logWebVitals } from '@/lib/web-vitals'

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Preload critical resources on mount
    preloadCriticalResources()
    
    // Track web vitals
    trackWebVitals()
    
    // Enhanced web vitals reporting
    reportWebVitals(logWebVitals)
    
    // Report performance metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            console.log('Navigation timing:', entry)
          }
        }
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      
      return () => observer.disconnect()
    }
  }, [])

  return <>{children}</>
}

export default PerformanceProvider
