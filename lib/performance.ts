// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now()
    
    const result = fn()
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now()
        console.log(`${name} took ${end - start} milliseconds`)
      })
    } else {
      const end = performance.now()
      console.log(`${name} took ${end - start} milliseconds`)
      return result
    }
  }
  
  return fn()
}

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(console.log)
      onINP(console.log)
      onFCP(console.log)
      onLCP(console.log)
      onTTFB(console.log)
    })
  }
}

// Resource preloading
export const preloadResource = (href: string, as: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }
}

// Critical resource preloading
export const preloadCriticalResources = () => {
  // Preload critical fonts
  preloadResource('/fonts/inter.woff2', 'font')
  
  // Preload critical images
  preloadResource('/images/logo.png', 'image')
  
  // Preload critical CSS
  preloadResource('/styles/globals.css', 'style')
}

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    })
  }
  return null
}

export default {
  measurePerformance,
  trackWebVitals,
  preloadResource,
  preloadCriticalResources,
  createIntersectionObserver
}
