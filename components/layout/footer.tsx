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
              <div className="content-footer py-[60px] flex justify-between items-center max-lg:flex-col max-lg:gap-8">
                {/* Company Info */}
                <div className="company-infor max-lg:text-center">
                  <Link href={'/'} className="logo">
                    <div className="heading4">Fungift</div>
                  </Link>
                  <div className='flex gap-3 mt-3 max-lg:justify-center'>
                    <div className="flex flex-col ">
                      <span className="text-button">Mail:</span>
                      <span className="text-button mt-3">Phone:</span>
                      <span className="text-button mt-3">Address:</span>
                    </div>
                    <div className="flex flex-col ">
                      <span className=''>hi.fungift@gmail.com</span>
                      <span className='mt-3'>254-733-345-686</span>
                      <span className='mt-3 pt-px'>Nairobi, Kenya</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="social-section max-lg:order-first">
                  <div className="text-button-uppercase pb-3 text-center">Follow Us</div>
                  <div className="list-social flex items-center gap-6">
                    <Link href={'https://www.facebook.com/'} target='_blank'>
                      <div className="icon-facebook text-2xl text-black hover:text-gray-600 transition-colors duration-300"></div>
                    </Link>
                    <Link href={'https://www.instagram.com/'} target='_blank'>
                      <div className="icon-instagram text-2xl text-black hover:text-gray-600 transition-colors duration-300"></div>
                    </Link>
                    <Link href={'https://www.twitter.com/'} target='_blank'>
                      <div className="icon-twitter text-2xl text-black hover:text-gray-600 transition-colors duration-300"></div>
                    </Link>
                    <Link href={'https://www.youtube.com/'} target='_blank'>
                      <div className="icon-youtube text-2xl text-black hover:text-gray-600 transition-colors duration-300"></div>
                    </Link>
                    <Link href={'https://www.pinterest.com/'} target='_blank'>
                      <div className="icon-pinterest text-2xl text-black hover:text-gray-600 transition-colors duration-300"></div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer Bottom */}
              <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
                <div className="left flex items-center gap-8">
                  <div className="copyright caption1 text-secondary">©2025 Fungift. All Rights Reserved.</div>
                  <div className="select-block flex items-center gap-5 max-md:hidden">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}

export default Footer