import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

export interface WebVitalsMetric {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  entries: PerformanceEntry[]
}

export function reportWebVitals(onPerfEntry?: (metric: WebVitalsMetric) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry)
    onINP(onPerfEntry)
    onFCP(onPerfEntry)
    onLCP(onPerfEntry)
    onTTFB(onPerfEntry)
  }
}

export function logWebVitals(metric: WebVitalsMetric) {
  console.log(`[Web Vitals] ${metric.name}:`, {
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
  })
  
  // You can send this data to your analytics service
  // Example: analytics.track('Web Vitals', metric)
}

export function getPerformanceGrade(metrics: Record<string, number>): string {
  const { CLS, FID, FCP, LCP, TTFB } = metrics
  
  let score = 0
  let total = 0
  
  // CLS (Cumulative Layout Shift)
  if (CLS !== undefined) {
    score += CLS <= 0.1 ? 100 : CLS <= 0.25 ? 75 : 50
    total += 100
  }
  
  // FID (First Input Delay)
  if (FID !== undefined) {
    score += FID <= 100 ? 100 : FID <= 300 ? 75 : 50
    total += 100
  }
  
  // FCP (First Contentful Paint)
  if (FCP !== undefined) {
    score += FCP <= 1800 ? 100 : FCP <= 3000 ? 75 : 50
    total += 100
  }
  
  // LCP (Largest Contentful Paint)
  if (LCP !== undefined) {
    score += LCP <= 2500 ? 100 : LCP <= 4000 ? 75 : 50
    total += 100
  }
  
  // TTFB (Time to First Byte)
  if (TTFB !== undefined) {
    score += TTFB <= 800 ? 100 : TTFB <= 1800 ? 75 : 50
    total += 100
  }
  
  const percentage = total > 0 ? (score / total) * 100 : 0
  
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}
