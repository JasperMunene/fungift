'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopFilter from '@/components/Shop/ShopFilter'
import Footer from '@/components/layout/footer'

// Component that uses useSearchParams
function GiftsContent() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    return (
        <div className="shop-square">
            <ShopFilter
                collectionHandle="gifts"
                productPerPage={12}
                pageTitle="Gifts"
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
                <GiftsContent />
            </Suspense>
            <Footer />
        </>
    )
}
