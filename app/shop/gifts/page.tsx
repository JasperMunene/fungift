'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopFilter from '@/components/Shop/ShopFilter'
import Footer from '@/components/layout/footer'

function GiftsContent() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <div className="shop-square">
                <ShopFilter
                    collectionHandle="gifts"
                    productPerPage={12}
                    pageTitle="Gifts"
                />
            </div>
            <Footer />
        </>
    )
}

export default function FilterDropdown() {
    return (
        <Suspense fallback={null}>
            <GiftsContent />
        </Suspense>
    )
}
