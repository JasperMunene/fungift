// lib/shopify-search.ts
import client from './shopify';
import { transformShopifyProduct } from './shopify-collections';
import { ProductType } from '@/type/ProductType';

// GraphQL query for searching products
export const SEARCH_PRODUCTS = `
  query searchProducts($query: String!, $first: Int!) {
    products(query: $query, first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          vendor
          productType
          tags
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
                quantityAvailable
              }
            }
          }
        }
      }
    }
  }
`;

// Interface for search response
interface SearchResponse {
    products: {
        edges: Array<{
            node: any; // Shopify product type
        }>;
    };
}

export const searchProducts = async (query: string, limit: number = 10): Promise<any[]> => {
    try {
        const response = await client.request(SEARCH_PRODUCTS, {
            variables: { query, first: limit }
        });

        const data = (response?.data || response) as SearchResponse;
        return data?.products?.edges?.map(e => e.node) ?? [];
    } catch (error) {
        console.error('Error searching products:', error);
        throw new Error('Failed to search products');
    }
};

// If you need a specific transform function for search results
export const transformSearchProduct = (product: any): ProductType => {
    // Use the same transformation as collections for consistency
    return transformShopifyProduct(product);
};