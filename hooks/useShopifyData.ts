import { useState, useEffect, useCallback, useRef } from 'react';

// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

interface UseShopifyDataOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  enabled?: boolean; // Whether to fetch data immediately
}

interface UseShopifyDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

export function useShopifyData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseShopifyDataOptions = {}
): UseShopifyDataReturn<T> {
  const { ttl = 5 * 60 * 1000, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      setData(cached.data);
      setError(null);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFn();
      
      if (!abortController.signal.aborted) {
        setData(result);
        
        // Cache the result
        cache.set(key, {
          data: result,
          timestamp: Date.now(),
          ttl
        });
      }
    } catch (err) {
      if (!abortController.signal.aborted) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
        console.error(`Error fetching data for key "${key}":`, err);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [key, fetchFn, ttl]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, enabled]);

  const refetch = useCallback(async () => {
    // Clear cache for this key
    cache.delete(key);
    await fetchData();
  }, [key, fetchFn, ttl]);

  const isStale = useCallback(() => {
    const cached = cache.get(key);
    if (!cached) return true;
    return Date.now() - cached.timestamp >= cached.ttl;
  }, [key]);

  return {
    data,
    loading,
    error,
    refetch,
    isStale: isStale()
  };
}

// Hook for fetching multiple collections at once using the optimized function
export function useMultipleCollections(
  collections: Array<{ handle: string; limit: number }>,
  options: UseShopifyDataOptions = {}
) {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the optimized function for multiple collections
      const { getMultipleCollections } = await import('@/lib/shopify-collections');
      
      const collectionHandles = collections.map(c => c.handle);
      const maxLimit = Math.max(...collections.map(c => c.limit));
      
      const result = await getMultipleCollections(collectionHandles, maxLimit);
      
      // Transform the data to match the expected format
      const resultData: Record<string, any> = {};
      collections.forEach(({ handle, limit }) => {
        const collectionData = result[handle];
        if (collectionData) {
          resultData[handle] = {
            products: collectionData.products.slice(0, limit),
            details: collectionData.details
          };
        } else {
          resultData[handle] = { products: [], details: null };
        }
      });

      setData(resultData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch collections';
      setError(errorMessage);
      console.error('Error fetching multiple collections:', err);
    } finally {
      setLoading(false);
    }
  }, [collections]);

  useEffect(() => {
    if (options.enabled !== false) {
      fetchAllCollections();
    }
  }, [fetchAllCollections, options.enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchAllCollections
  };
}
