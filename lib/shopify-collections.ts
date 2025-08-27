// lib/shopify-collections.ts
import client from './shopify';

/* -------------------------
   GraphQL queries
   ------------------------- */
export const GET_COLLECTION_PRODUCTS = `
  query getCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
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
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_PRODUCTS_DETAILED = `
  query getCollectionProductsDetailed($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            vendor
            productType
            tags
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 50) {
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
  }
`;

/* -------------------------
   Types (lightweight)
   ------------------------- */
export interface ShopifyProduct {
    id: string;
    title?: string;
    handle?: string;
    description?: string;
    vendor?: string;
    productType?: string;
    tags?: string[];
    images?: { edges: Array<{ node: { url?: string; altText?: string } }> };
    variants?: {
        edges: Array<{
            node: {
                id: string;
                title?: string;
                price?: { amount?: string; currencyCode?: string };
                compareAtPrice?: { amount?: string; currencyCode?: string };
                availableForSale?: boolean;
                selectedOptions?: Array<{ name?: string; value?: string }>;
                quantityAvailable?: number;
            };
        }>;
    };
}

export interface ShopifyCollectionResponse {
    collection: {
        id: string;
        title: string;
        description?: string;
        products: {
            edges: Array<{ node: ShopifyProduct }>;
        };
    };
}

/* -------------------------
   Helper functions
   ------------------------- */
function getColorCode(colorName: string = ''): string {
    const colorMap: { [k: string]: string } = {
        'black': '#000000',
        'white': '#ffffff',
        'red': '#ff0000',
        'blue': '#0000ff',
        'green': '#008000',
        'yellow': '#ffff00',
        'pink': '#ffc0cb',
        'purple': '#800080',
        'orange': '#ffa500',
        'brown': '#a52a2a',
        'grey': '#808080',
        'gray': '#808080',
        'navy': '#000080',
        'beige': '#f5f5dc'
    };
    return colorMap[colorName.toLowerCase()] || '#cccccc';
}

function extractCategory(tags: string[] = []): string {
    const categoryMap: { [k: string]: string } = {
        'yoga': 'yoga',
        'fitness': 'fitness',
        'activewear': 'activewear',
        'tops': 'tops',
        'bottoms': 'bottoms',
        'accessories': 'accessories'
    };
    for (const tag of tags || []) {
        if (categoryMap[(tag || '').toLowerCase()]) return categoryMap[tag.toLowerCase()];
    }
    return 'general';
}

function extractGender(tags: string[] = []): string {
    const genderTags = (tags || []).map(t => (t || '').toLowerCase());
    if (genderTags.some(t => ['men', 'male', 'mens'].includes(t))) return 'men';
    if (genderTags.some(t => ['women', 'female', 'womens'].includes(t))) return 'women';
    if (genderTags.some(t => ['unisex', 'all'].includes(t))) return 'unisex';
    return 'unisex';
}

/* -------------------------
   Functions that fetch from Shopify
   ------------------------- */

export async function getCollectionProducts(handle: string, first: number = 20): Promise<ShopifyProduct[]> {
    const response = await client.request(GET_COLLECTION_PRODUCTS, { variables: { handle, first } });
    const data = (response?.data || response) as ShopifyCollectionResponse;
    return data?.collection?.products?.edges?.map(e => e.node) ?? [];
}

export async function getCollectionProductsDetailed(handle: string, first: number = 100): Promise<ShopifyProduct[]> {
    const response = await client.request(GET_COLLECTION_PRODUCTS_DETAILED, { variables: { handle, first } });
    const data = (response?.data || response) as ShopifyCollectionResponse;
    return data?.collection?.products?.edges?.map(e => e.node) ?? [];
}


export function transformShopifyProduct(shopifyProduct: ShopifyProduct) {
    const imagesEdges = shopifyProduct.images?.edges ?? [];
    const variantsEdges = shopifyProduct.variants?.edges ?? [];
    const firstVariant = variantsEdges[0]?.node;
    const price = parseFloat(firstVariant?.price?.amount ?? '0') || 0;
    const compareAtPrice = parseFloat(firstVariant?.compareAtPrice?.amount ?? '0') || 0;

    const colors = Array.from(new Set(
        variantsEdges
            .map(e => e.node.selectedOptions?.find(o => o?.name?.toLowerCase() === 'color')?.value)
            .filter(Boolean) as string[]
    ));

    const sizes = Array.from(new Set(
        variantsEdges
            .map(e => e.node.selectedOptions?.find(o => o?.name?.toLowerCase() === 'size')?.value)
            .filter(Boolean) as string[]
    ));

    const variation = colors.map(color => {
        const colorLower = (color || '').toLowerCase();
        const found = imagesEdges.find(edge => (edge?.node?.altText ?? '').toLowerCase().includes(colorLower));
        const colorImage = found?.node?.url ?? imagesEdges[0]?.node?.url ?? '';
        return {
            color,
            colorCode: getColorCode(color),
            colorImage,
            image: colorImage
        };
    });

    // Add default values for the missing properties
    return {
        id: shopifyProduct.id,
        category: extractCategory(shopifyProduct.tags ?? []),
        type: 'product',
        name: shopifyProduct.title ?? '',
        description: shopifyProduct.description ?? '',
        price,
        originPrice: compareAtPrice > price ? compareAtPrice : price,
        sale: compareAtPrice > price,
        new: (shopifyProduct.tags ?? []).some(t => (t || '').toLowerCase() === 'new'),
        sold: Math.floor(Math.random() * 100),
        quantity: 100,
        quantityPurchase: 1,
        sizes: sizes.length > 0 ? sizes : ['freesize'],
        thumbImage: imagesEdges.map(e => e?.node?.url ?? '').filter(Boolean),
        images: imagesEdges.map(e => e?.node?.url ?? '').filter(Boolean),
        variation,
        action: 'add to cart',
        rate: 5,
        // Add the missing properties with default values
        gender: extractGender(shopifyProduct.tags ?? []),
        brand: shopifyProduct.vendor || 'Unknown Brand',
        slug: shopifyProduct.handle || `product-${shopifyProduct.id}`
    };
}

export function transformShopifyProductDetailed(shopifyProduct: ShopifyProduct) {
    const imagesEdges = shopifyProduct.images?.edges ?? [];
    const variantsEdges = shopifyProduct.variants?.edges ?? [];
    const firstVariant = variantsEdges[0]?.node;
    const price = parseFloat(firstVariant?.price?.amount ?? '0') || 0;
    const compareAtPrice = parseFloat(firstVariant?.compareAtPrice?.amount ?? '0') || 0;

    const colors = Array.from(new Set(
        variantsEdges
            .map(e => e.node.selectedOptions?.find(o => ['color', 'colour'].includes((o?.name || '').toLowerCase()))?.value)
            .filter(Boolean) as string[]
    ));

    const sizes = Array.from(new Set(
        variantsEdges
            .map(e => e.node.selectedOptions?.find(o => (o?.name || '').toLowerCase() === 'size')?.value)
            .filter(Boolean) as string[]
    ));

    const totalQuantity = variantsEdges.reduce((total, e) => total + (e?.node?.quantityAvailable ?? 0), 0);
    const soldQuantity = Math.floor(Math.random() * Math.min(Math.max(totalQuantity * 0.3, 0), 50));

    const variation = colors.map(color => {
        const colorLower = (color || '').toLowerCase();
        const found = imagesEdges.find(edge => (edge?.node?.altText ?? '').toLowerCase().includes(colorLower));
        const colorImage = found?.node?.url ?? imagesEdges[0]?.node?.url ?? '';
        return {
            color,
            colorCode: getColorCode(color),
            colorImage,
            image: colorImage
        };
    });

    const productTypeStr = (shopifyProduct.productType ?? '').toString().toLowerCase();
    const categoryMap: { [k: string]: string } = {
        't-shirt': 't-shirt', 'tshirt': 't-shirt', 'shirt': 'shirt', 'dress': 'dress',
        'top': 'top', 'blouse': 'top', 'tank': 'top', 'swimwear': 'swimwear',
        'bikini': 'swimwear', 'underwear': 'underwear', 'lingerie': 'underwear',
        'accessories': 'accessories', 'jewelry': 'accessories', 'bag': 'accessories', 'hat': 'accessories'
    };

    const mappedType = categoryMap[productTypeStr] || Object.keys(categoryMap).find(k => productTypeStr.includes(k)) || 'accessories';

    return {
        id: shopifyProduct.id,
        category: 'fashion',
        type: mappedType,
        name: shopifyProduct.title ?? '',
        description: shopifyProduct.description ?? '',
        price,
        originPrice: compareAtPrice > price ? compareAtPrice : price,
        sale: compareAtPrice > price,
        new: (shopifyProduct.tags ?? []).some(t => ['new', 'latest', 'recent'].includes((t || '').toLowerCase())),
        sold: soldQuantity,
        quantity: totalQuantity,
        quantityPurchase: 1,
        sizes: sizes.length > 0 ? sizes : ['freesize'],
        thumbImage: imagesEdges.map(e => e?.node?.url ?? '').filter(Boolean),
        images: imagesEdges.map(e => e?.node?.url ?? '').filter(Boolean),
        variation,
        action: 'add to cart',
        rate: Math.floor(Math.random() * 2) + 4,
        brand: shopifyProduct.vendor ?? 'Unknown',
        gender: extractGender(shopifyProduct.tags ?? []),
        slug: shopifyProduct.handle ?? ''
    };
}

// Add to shopify-collections.ts

export async function getCollectionDetails(handle: string) {
    const query = `
    query getCollectionDetails($handle: String!) {
      collection(handle: $handle) {
        id
        title
        description
      }
    }
  `;

    try {
        const response = await client.request(query, { variables: { handle } });
        return response?.data?.collection || null;
    } catch (error) {
        console.error('Error fetching collection details:', error);
        return null;
    }
}