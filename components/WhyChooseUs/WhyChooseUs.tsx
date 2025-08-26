import React from 'react'
import Image from 'next/image'

const WhyChooseUs = () => {
    return (
        <>
            <div className="why-choose-us md:pt-20 pt-10 mb-20">
                <div className="container">
                    <div className="content flex max-lg:flex-col items-center justify-between gap-y-8">
                        <div className="left lg:w-1/2 sm:w-2/3 w-full lg:pr-4">
                            <div className="bg-img">
                                <Image
                                    src={'/images/gifting-3.jpg'}
                                    width={2000}
                                    height={2000}
                                    alt='gift-display'
                                    className='w-full rounded-2xl'
                                />
                            </div>
                        </div>
                        <div className="right lg:w-1/2 lg:pl-16">
                            <div className="heading3">Why Choose Us for Your Gifting Moments?</div>
                            <div className='text-secondary mt-5'>
                                We believe every gift should tell a story. From curated collections to meaningful touches, we make it easy to give joy, love, and unforgettable memories.
                            </div>
                            <div className="list-feature mt-6 pt-6 border-t border-line">
                                <div className="item flex items-center justify-between pb-3 border-b border-line">
                                    <div className="body1 font-semibold uppercase">Our Promise:</div>
                                    <div className="body1">Thoughtfully curated gifts for every occasion</div>
                                </div>
                                <div className="item flex items-center justify-between pb-3 border-b border-line mt-3">
                                    <div className="body1 font-semibold uppercase">Our Craft:</div>
                                    <div className="body1">Attention to detail in every package</div>
                                </div>
                                <div className="item flex items-center justify-between pb-3 border-b border-line mt-3">
                                    <div className="body1 font-semibold uppercase">For You:</div>
                                    <div className="body1">For those who want to give something truly special</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WhyChooseUs
