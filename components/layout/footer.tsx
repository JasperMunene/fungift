import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";

const Footer = () => {
  return (
      <>
        <div id="footer" className='footer'>
          <div className="footer-main bg-surface">
            <div className="container">
              <div className="content-footer py-[60px] flex justify-between flex-wrap gap-y-8">
                {/* Company Info */}
                <div className="company-infor basis-1/4 max-lg:basis-full pr-7">
                  <Link href={'/'} className="logo">
                    <div className="heading4">Fungift</div>
                  </Link>
                  <div className='flex gap-3 mt-3'>
                    <div className="flex flex-col ">
                      <span className="text-button">Mail:</span>
                      <span className="text-button mt-3">Phone:</span>
                      <span className="text-button mt-3">Address:</span>
                    </div>
                    <div className="flex flex-col ">
                      <span className=''>hi.fungift@gmail.com</span>
                      <span className='mt-3'>1-333-345-6868</span>
                      <span className='mt-3 pt-px'>549 Oak St. Crystal Lake, IL 60014</span>
                    </div>
                  </div>
                </div>

                {/* Right Content */}
                <div className="right-content flex flex-wrap gap-y-8 basis-3/4 max-lg:basis-full">
                  <div className="list-nav flex justify-between basis-2/3 max-md:basis-full gap-4">

                    {/* Information */}
                    <div className="item flex flex-col basis-1/3 ">
                      <div className="text-button-uppercase pb-3">Information</div>
                      <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/contact'}>Contact us</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'#!'}>Career</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/my-account'}>My Account</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/order-tracking'}>Orders & Returns</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>FAQs</Link>
                    </div>

                    {/* Shop Categories */}
                    <div className="item flex flex-col basis-1/3 ">
                      <div className="text-button-uppercase pb-3">Gift Shop</div>
                      <Link className='caption1 has-line-before duration-300 w-fit' href={'/shop/physical-gifts'}>Physical Gifts</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/gift-cards'}>Gift Cards</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/occasions'}>Occasions</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/brands'}>Partner Stores</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/blog'}>Gift Ideas</Link>
                    </div>

                    {/* Customer Service */}
                    <div className="item flex flex-col basis-1/3 ">
                      <div className="text-button-uppercase pb-3">Customer Services</div>
                      <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/faqs'}>Orders FAQs</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>Shipping & Delivery</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/privacy'}>Privacy Policy</Link>
                      <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/order-tracking'}>Returns & Refunds</Link>
                    </div>
                  </div>

                  {/* Newsletter */}
                  <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                    <div className="text-button-uppercase">Newsletter</div>
                    <div className="caption1 mt-3">Sign up for gift ideas & exclusive offers</div>
                    <div className="input-block w-full h-[52px] mt-4">
                      <form className='w-full h-full relative' action="post">
                        <input type="email" placeholder='Enter your e-mail' className='caption1 w-full h-full pl-4 pr-14 rounded-xl border border-line' required />
                        <button className='w-[44px] h-[44px] bg-black flex items-center justify-center rounded-xl absolute top-1 right-1'>
                          <Icon.ArrowRight size={24} color='#fff' />
                        </button>
                      </form>
                    </div>
                    <div className="list-social flex items-center gap-6 mt-4">
                      <Link href={'https://www.facebook.com/'} target='_blank'>
                        <div className="icon-facebook text-2xl text-black"></div>
                      </Link>
                      <Link href={'https://www.instagram.com/'} target='_blank'>
                        <div className="icon-instagram text-2xl text-black"></div>
                      </Link>
                      <Link href={'https://www.twitter.com/'} target='_blank'>
                        <div className="icon-twitter text-2xl text-black"></div>
                      </Link>
                      <Link href={'https://www.youtube.com/'} target='_blank'>
                        <div className="icon-youtube text-2xl text-black"></div>
                      </Link>
                      <Link href={'https://www.pinterest.com/'} target='_blank'>
                        <div className="icon-pinterest text-2xl text-black"></div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Bottom */}
              <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
                <div className="left flex items-center gap-8">
                  <div className="copyright caption1 text-secondary">©2025 Fungift. All Rights Reserved.</div>
                  <div className="select-block flex items-center gap-5 max-md:hidden">
                    <div className="choose-language flex items-center gap-1.5">
                      <select name="language" id="chooseLanguageFooter" className='caption2 bg-transparent'>
                        <option value="English">English</option>
                        <option value="Espana">Espana</option>
                        <option value="France">France</option>
                      </select>
                      <Icon.CaretDown size={12} color='#1F1F1F' />
                    </div>
                    <div className="choose-currency flex items-center gap-1.5">
                      <select name="currency" id="chooseCurrencyFooter" className='caption2 bg-transparent'>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                      <Icon.CaretDown size={12} color='#1F1F1F' />
                    </div>
                  </div>
                </div>
                <div className="right flex items-center gap-2">
                  <div className="caption1 text-secondary">Payment:</div>
                  {[0,1,2,3,4,5].map((i) => (
                      <div className="payment-img" key={i}>
                        <Image
                            src={`/images/payment/Frame-${i}.png`}
                            width={500}
                            height={500}
                            alt={'payment'}
                            className='w-9'
                        />
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}

export default Footer
