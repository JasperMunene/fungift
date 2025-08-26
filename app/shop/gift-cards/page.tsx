'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopFilter2 from '@/components/Shop/ShopFilter'
import productData from '@/data/Product.json'
import Footer from '@/components/layout/footer'

export default function FilterDropdown() {
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
                <ShopFilter2
                    collectionHandle="gift-cards"
                    productPerPage={12}
                    pageTitle="Gift Cards"
                />
            </div>
            <Footer />
        </>
    )
}
