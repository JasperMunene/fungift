'use client'

import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, Truck, Mail, ArrowRight, Star, Gift } from 'lucide-react';

export default function ThankYouPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [confettiActive, setConfettiActive] = useState(true);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => setConfettiActive(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const orderSteps = [
        {
            icon: <CheckCircle className="w-5 h-5" />,
            title: "Order Confirmed",
            description: "Your payment has been processed",
            status: "completed"
        },
        {
            icon: <Package className="w-5 h-5" />,
            title: "Preparing Order",
            description: "We're getting your items ready",
            status: "active"
        },
        {
            icon: <Truck className="w-5 h-5" />,
            title: "Shipped",
            description: "Your order is on its way",
            status: "pending"
        },
        {
            icon: <Mail className="w-5 h-5" />,
            title: "Delivered",
            description: "Enjoy your new items!",
            status: "pending"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            {confettiActive && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        >
                            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-70"></div>
                        </div>
                    ))}
                </div>
            )}

            <div className="relative z-10 container mx-auto px-4 py-12">
                <div className={`max-w-4xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                    {/* Main Success Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 shadow-lg">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                Thank You!
                            </h1>
                            <p className="text-xl text-gray-600 mb-2">
                                Your order has been successfully placed
                            </p>
                            <p className="text-gray-500">
                                Order #12345 • Estimated delivery: 3-5 business days
                            </p>
                        </div>

                        {/* Order Progress */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
                                Order Status
                            </h3>
                            <div className="flex justify-between items-center relative">
                                {/* Progress Line */}
                                <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-1/4 transition-all duration-1000"></div>
                                </div>

                                {orderSteps.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center relative z-10">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                                            step.status === 'completed'
                                                ? 'bg-green-500 text-white shadow-lg'
                                                : step.status === 'active'
                                                    ? 'bg-blue-500 text-white shadow-lg animate-pulse'
                                                    : 'bg-gray-200 text-gray-400'
                                        }`}>
                                            {step.icon}
                                        </div>
                                        <div className="text-center mt-3">
                                            <p className={`font-medium text-sm ${
                                                step.status === 'completed' || step.status === 'active'
                                                    ? 'text-gray-800'
                                                    : 'text-gray-400'
                                            }`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {/* Email Confirmation */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-800">Email Sent</h3>
                                    <p className="text-sm text-gray-500">Check your inbox</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                We've sent a confirmation email with your order details and tracking information.
                            </p>
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center group">
                                Resend Email
                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Track Order */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    <Package className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-800">Track Order</h3>
                                    <p className="text-sm text-gray-500">Monitor progress</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Keep an eye on your order status and get real-time updates.
                            </p>
                            <button className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center group">
                                View Tracking
                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Continue Shopping */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <Gift className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-800">Keep Shopping</h3>
                                    <p className="text-sm text-gray-500">Discover more</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Browse our latest collection and exclusive deals just for you.
                            </p>
                            <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center group">
                                Continue Shopping
                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Customer Review Prompt */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mr-4">
                                    <Star className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Love your purchase?</h3>
                                    <p className="text-sm text-gray-600">Share your experience with other customers</p>
                                </div>
                            </div>
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl">
                                Write a Review
                            </button>
                        </div>
                    </div>

                    {/* Social Sharing */}
                    <div className="text-center mt-8 p-6">
                        <p className="text-gray-600 mb-4">Share the love with your friends!</p>
                        <div className="flex justify-center space-x-4">
                            {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                                <button
                                    key={social}
                                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                    title={`Share on ${social}`}
                                >
                  <span className="text-xs font-medium text-gray-600">
                    {social.charAt(0)}
                  </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}