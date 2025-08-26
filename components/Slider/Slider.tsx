'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Slider = () => {
    return (
        <>
            <div className="slider-block style-one bg-linear xl:py-[100px] px-4 md:py-20 py-14 w-full">
                <div className="slider-main h-full w-full flex items-center justify-center gap-10">
                    <div className="sub-img w-[440px] max-md:w-1/2 rounded-b-full overflow-hidden max-md:hidden">
                        <Image
                            src={'/images/gifting-2.jpg'}
                            width={2000}
                            height={1936}
                            alt='gift-image-1'
                            priority={true}
                            className='w-full'
                        />
                    </div>
                    <div className="text-content w-fit">
                        <div className="text-sub-display text-center">
                            Up to 50% Off!
                        </div>
                        <div className="text-display text-center md:mt-4 mt-2">
                            Gifts Made Easy
                        </div>
                        <div className="text-center">
                            <Link href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">
                                Shop Gifts
                            </Link>
                        </div>
                    </div>
                    <div className="sub-img w-[440px] max-md:w-1/2 rounded-t-full overflow-hidden">
                        <Image
                            src={'/images/gifting-1.jpg'}
                            width={2000}
                            height={1936}
                            alt='gift-image-2'
                            priority={true}
                            className='w-full'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Slider
