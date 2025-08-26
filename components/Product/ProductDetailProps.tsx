"use client";
import { useState, useEffect } from "react";

interface ProductDetailProps {
    product: any;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<any>(product.variants?.[0] || null);

    // --- Find matching variant based on selections ---
    const findVariant = () => {
        const matchingVariant = product.variants?.find((variant: any) => {
            const opts = variant?.selectedOptions || [];

            const hasColor = selectedColor
                ? opts.some((o: any) => o?.name.toLowerCase() === "color" && o?.value === selectedColor)
                : true;

            const hasSize = selectedSize
                ? opts.some((o: any) => o?.name.toLowerCase() === "size" && o?.value === selectedSize)
                : true;

            const hasAmount = selectedAmount
                ? opts.some(
                    (o: any) =>
                        o?.name.toLowerCase() === "denomination" &&
                        Number(o?.value.replace("$", "")) === selectedAmount
                )
                : true;

            return hasColor && hasSize && hasAmount;
        });

        return matchingVariant || product.variants?.[0];
    };

    // --- Update selected variant when options change ---
    useEffect(() => {
        const variant = findVariant();
        setSelectedVariant(variant);
    }, [selectedColor, selectedSize, selectedAmount]);

    // --- Handle Add to Cart / Checkout ---
    const handleCheckout = async () => {
        if (!selectedVariant) return;

        const res = await fetch("/api/checkout", {
            method: "POST",
            body: JSON.stringify({
                lineItems: [
                    {
                        variantId: selectedVariant.id,
                        quantity: 1,
                        amount: selectedAmount, // optional for logging
                    },
                ],
            }),
        });

        const data = await res.json();
        if (data?.webUrl) {
            window.location.href = data.webUrl;
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            {/* --- Product Title --- */}
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

            {/* --- Dynamic Price --- */}
            <div className="text-2xl font-semibold text-gray-900 mb-4">
                ${selectedVariant?.price?.amount || product.price}
            </div>

            {/* --- Options: Colors --- */}
            {product.options?.some((o: any) => o.name.toLowerCase() === "color") && (
                <div className="mb-4">
                    <h3 className="font-medium mb-1">Color</h3>
                    <div className="flex gap-2">
                        {product.options
                            .find((o: any) => o.name.toLowerCase() === "color")
                            ?.values.map((color: string) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-3 py-1 rounded border ${
                                        selectedColor === color ? "bg-black text-white" : "bg-white"
                                    }`}
                                >
                                    {color}
                                </button>
                            ))}
                    </div>
                </div>
            )}

            {/* --- Options: Size --- */}
            {product.options?.some((o: any) => o.name.toLowerCase() === "size") && (
                <div className="mb-4">
                    <h3 className="font-medium mb-1">Size</h3>
                    <div className="flex gap-2">
                        {product.options
                            .find((o: any) => o.name.toLowerCase() === "size")
                            ?.values.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-3 py-1 rounded border ${
                                        selectedSize === size ? "bg-black text-white" : "bg-white"
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                    </div>
                </div>
            )}

            {/* --- Options: Amount (Gift Cards) --- */}
            {product.options?.some((o: any) => o.name.toLowerCase() === "denomination") && (
                <div className="mb-4">
                    <h3 className="font-medium mb-1">Amount</h3>
                    <div className="flex gap-2">
                        {product.options
                            .find((o: any) => o.name.toLowerCase() === "denomination")
                            ?.values.map((amount: string) => {
                                const num = Number(amount.replace("$", ""));
                                return (
                                    <button
                                        key={amount}
                                        onClick={() => setSelectedAmount(num)}
                                        className={`px-3 py-1 rounded border ${
                                            selectedAmount === num ? "bg-black text-white" : "bg-white"
                                        }`}
                                    >
                                        {amount}
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* --- Checkout Button --- */}
            <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
            >
                Add to Cart / Checkout
            </button>
        </div>
    );
}
