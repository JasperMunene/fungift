// utils/shopify.ts
const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN!;

export async function shopifyFetch(query: string, variables: any = {}) {
    const res = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
        console.error(json.errors);
        throw new Error("Shopify API Error");
    }

    return json.data;
}
