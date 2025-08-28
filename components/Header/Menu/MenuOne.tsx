'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname } from 'next/navigation';
import Product from '@/components/Product/Product';
import productData from '@/data/Product.json'
import useLoginPopup from '@/store/useLoginPopup';
import useMenuMobile from '@/store/useMenuMobile';
import { useModalCartContext } from '@/context/ModalCartContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useModalSearchContext } from '@/context/ModalSearchContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface Props {
    props: string;
}

const MenuOne: React.FC<Props> = ({ props }) => {
    const router = useRouter()
    const pathname = usePathname()
    let [selectedType, setSelectedType] = useState<string | null>()
    const { openLoginPopup, handleLoginPopup } = useLoginPopup()
    const { openMenuMobile, handleMenuMobile } = useMenuMobile()
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null)
    const { openModalCart } = useModalCartContext()
    const { cartState } = useCart()
    const { openModalWishlist } = useModalWishlistContext()
    const { openModalSearch } = useModalSearchContext()

    const handleOpenSubNavMobile = (index: number) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index)
    }

    const [fixedHeader, setFixedHeader] = useState(false)
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };

        // Gắn sự kiện cuộn khi component được mount
        window.addEventListener('scroll', handleScroll);

        // Hủy sự kiện khi component bị unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPosition]);

    const handleGenderClick = (gender: string) => {
        router.push(`/shop/breadcrumb1?gender=${gender}`);
    };

    const handleCategoryClick = (category: string) => {
        router.push(`/shop/breadcrumb1?category=${category}`);
    };

    const handleTypeClick = (type: string) => {
        setSelectedType(type)
        router.push(`/shop/breadcrumb1?type=${type}`);
    };

    return (
        <>
            <div className={`header-menu style-one ${fixedHeader ? 'fixed' : 'absolute'} top-0 left-0 right-0 w-full md:h-[74px] h-[56px] ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="header-main flex justify-between h-full">
                        <div className="menu-mobile-icon lg:hidden flex items-center" onClick={handleMenuMobile}>
                            <i className="icon-category text-2xl"></i>
                        </div>
                        <div className="left flex items-center gap-16">
                            <Link href={'/'} className='flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2'>
                                {/*<div className="heading4">Fungift</div>*/}
                            <Image src='/images/logo.png' alt='Logo' width={75} height={75} className='mt-4' />
                            </Link>
                            <div className="menu-main h-full max-lg:hidden">
                                <ul className='flex items-center gap-8 h-full'>

                                    <li className='h-full'>
                                        <Link
                                            href="/shop/gift-cards"
                                            className={`text-button-uppercase duration-300 h-full flex items-center justify-center px-4 hover:text-green transition-colors ${pathname.includes('/shop/gift-cards') ? 'active text-green' : ''}`}
                                        >
                                            Gift Cards
                                        </Link>
                                    </li>
                                    <li className='h-full'>
                                        <Link
                                            href="/shop/gifts"
                                            className={`text-button-uppercase duration-300 h-full flex items-center justify-center px-4 hover:text-green transition-colors ${pathname.includes('/shop/gifts') ? 'active text-green' : ''}`}
                                        >
                                            Gifts
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="right flex gap-12">
                            {/*<div className="max-md:hidden search-icon flex items-center cursor-pointer relative">*/}
                            {/*    <Icon.MagnifyingGlass size={24} color='black' onClick={openModalSearch} />*/}
                            {/*    <div className="line absolute bg-line w-px h-6 -right-6"></div>*/}
                            {/*</div>*/}
                            <div className="list-action flex items-center gap-4">
                                <div className="max-md:hidden wishlist-icon flex items-center cursor-pointer" onClick={openModalWishlist}>
                                    <Icon.Heart size={24} color='black' />
                                </div>
                                <div className="cart-icon flex items-center relative cursor-pointer" onClick={openModalCart}>
                                    <Icon.Handbag size={24} color='black' />
                                    <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="menu-mobile" className={`${openMenuMobile ? 'open' : ''}`}>
                <div className="menu-container bg-white h-full">
                    <div className="container h-full">
                        <div className="menu-main h-full overflow-hidden">
                            <div className="heading py-2 relative flex items-center justify-center">
                                <div
                                    className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                                    onClick={handleMenuMobile}
                                >
                                    <Icon.X size={14} />
                                </div>
                                <Link href={'/'} className='logo text-3xl font-semibold text-center'>Fungift</Link>
                            </div>
                            <div className="form-search relative mt-2">
                                <Icon.MagnifyingGlass size={20} className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer' />
                                <input type="text" placeholder='What are you looking for?' className=' h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4' />
                            </div>
                            <div className="list-nav mt-6">
                                <ul>
                                    <li
                                        className={`${openSubNavMobile === 3 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(3)}
                                    >
                                        <a href={'/'} className='text-xl font-semibold flex items-center justify-between mt-5'>Home
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                    </li>
                                    <li
                                        className={`${openSubNavMobile === 3 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(3)}
                                    >
                                        <a href={'/shop/gift-cards'} className='text-xl font-semibold flex items-center justify-between mt-5'>Gift Cards
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                    </li>
                                    <li
                                        className={`${openSubNavMobile === 4 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(4)}
                                    >
                                        <a href={'/shop/gifts'} className='text-xl font-semibold flex items-center justify-between mt-5'>Gifts
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*<div className="menu_bar fixed bg-white bottom-0 left-0 w-full h-[70px] sm:hidden z-[101]">*/}
            {/*    <div className="menu_bar-inner grid grid-cols-4 items-center h-full">*/}
            {/*        <Link href={'/'} className='menu_bar-link flex flex-col items-center gap-1'>*/}
            {/*            <Icon.House weight='bold' className='text-2xl' />*/}
            {/*            <span className="menu_bar-title caption2 font-semibold">Home</span>*/}
            {/*        </Link>*/}
            {/*        <Link href={'/shop/filter-canvas'} className='menu_bar-link flex flex-col items-center gap-1'>*/}
            {/*            /!*<Icon.List weight='bold' className='text-2xl' />*!/*/}
            {/*            /!*<span className="menu_bar-title caption2 font-semibold">Category</span>*!/*/}
            {/*        </Link>*/}
            {/*        <Link href={'/search-result'} className='menu_bar-link flex flex-col items-center gap-1'>*/}
            {/*            /!*<Icon.MagnifyingGlass weight='bold' className='text-2xl' />*!/*/}
            {/*            /!*<span className="menu_bar-title caption2 font-semibold">Search</span>*!/*/}
            {/*        </Link>*/}
            {/*        <Link href={'/cart'} className='menu_bar-link flex flex-col items-center gap-1'>*/}
            {/*            <div className="icon relative">*/}
            {/*                <Icon.Handbag weight='bold' className='text-2xl' />*/}
            {/*                <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span>*/}
            {/*            </div>*/}
            {/*            <span className="menu_bar-title caption2 font-semibold">Cart</span>*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    )
}

export default MenuOne