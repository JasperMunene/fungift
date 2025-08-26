'use client'

import React from 'react'
import Link from 'next/link';

interface Props {
    props: string;
    slogan: string;
}

const TopNavOne: React.FC<Props> = ({ props, slogan }) => {
    return (
        <div className={`top-nav md:h-[44px] h-[30px] ${props}`}>
            <div className="container mx-auto h-full">
                <div className="top-nav-main relative flex items-center justify-center h-full">

                    {/* Center slogan */}
                    <div className="text-center text-button-uppercase text-white">
                        {slogan}
                    </div>

                    {/* Social icons pinned right */}
                    <div className="right-content absolute right-0 flex items-center gap-5 max-md:hidden">
                        <Link href={'https://www.facebook.com/'} target='_blank'>
                            <i className="icon-facebook text-white"></i>
                        </Link>
                        <Link href={'https://www.instagram.com/'} target='_blank'>
                            <i className="icon-instagram text-white"></i>
                        </Link>
                        <Link href={'https://www.youtube.com/'} target='_blank'>
                            <i className="icon-youtube text-white"></i>
                        </Link>
                        <Link href={'https://twitter.com/'} target='_blank'>
                            <i className="icon-twitter text-white"></i>
                        </Link>
                        <Link href={'https://pinterest.com/'} target='_blank'>
                            <i className="icon-pinterest text-white"></i>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TopNavOne
