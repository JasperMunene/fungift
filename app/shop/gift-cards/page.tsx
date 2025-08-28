'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopFilter2 from '@/components/Shop/ShopFilter'
import Footer from '@/components/layout/footer'

// Component that uses useSearchParams
function GiftCardsContent() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    return (
        <div className="shop-square">
            <ShopFilter2
                collectionHandle="gift-cards"
                productPerPage={12}
                pageTitle="Gift Cards"
            />
        </div>
    )
}

export default function FilterDropdown() {
    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <GiftCardsContent />
            </Suspense>
            <Footer />
        </>
    )
}
