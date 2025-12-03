'use client'

import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Music2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Footer = () => {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <footer className="relative bg-green-500 py-8 sm:py-10 lg:py-12 overflow-hidden">
      {/* Decorative leaves - top right */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 opacity-60">
        <div className="w-full h-full bg-black rounded-full transform rotate-45"></div>
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gray-800 rounded-full transform -rotate-12"></div>
      </div>
      
      {/* Decorative leaves - bottom left */}
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 opacity-60">
        <div className="w-full h-full bg-black rounded-full transform -rotate-45"></div>
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gray-800 rounded-full transform rotate-12"></div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
     
        {/* Content Grid - Only show on non-homepage */}
        {!isHomePage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-jost font-bold text-white mb-3 sm:mb-4">Quick Links</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <Link href="/products" className="text-sm sm:text-base font-jost text-white hover:text-green-100 transition-colors duration-300">
                    Our Products
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm sm:text-base font-jost text-white hover:text-green-100 transition-colors duration-300">
                    About Nature Harvest
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm sm:text-base font-jost text-white hover:text-green-100 transition-colors duration-300">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="text-sm sm:text-base font-jost text-white hover:text-green-100 transition-colors duration-300">
                    Our Brands
                  </Link>
                </li>
              </ul>
            </div>

            {/* Manufacturing Facility Address */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-jost font-bold text-white mb-3 sm:mb-4">Manufacturing Facility</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start justify-center sm:justify-start text-white">
                  <MapPin className="h-4 w-4 mr-2 text-white flex-shrink-0 mt-1" />
                  <div className="text-sm sm:text-base font-jost">
                    <p>Plot No. T-28 A, New Industrial Area,</p>
                    <p>Mirpur, Azad Jammu and Kashmir</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Head Office Address & Contact Info */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-jost font-bold text-white mb-3 sm:mb-4">Head Office</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start justify-center sm:justify-start text-white">
                  <MapPin className="h-4 w-4 mr-2 text-white flex-shrink-0 mt-1" />
                  <div className="text-sm sm:text-base font-jost">
                    <p>9/E Block G, Main Boulevard Gulberg II,</p>
                    <p>Lahore, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start text-white mt-4">
                  <Phone className="h-4 w-4 mr-2 text-white flex-shrink-0" />
                  <span className="text-sm sm:text-base font-jost">+92 325 413 1111</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start text-white">
                  <Mail className="h-4 w-4 mr-2 text-white flex-shrink-0" />
                  <span className="text-sm sm:text-base font-jost break-all">info@natureharvest.com.pk</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-jost font-bold text-white mb-4 sm:mb-6">Connect With Us</h3>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="https://www.facebook.com/natureharvest.pk" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 group-hover:text-green-600" />
              </div>
              <p className="text-xs font-jost text-white mt-1 sm:mt-2">Facebook</p>
            </a>
            <a href="https://www.instagram.com/natureharvest.pk/" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 group-hover:text-green-600" />
              </div>
              <p className="text-xs font-jost text-white mt-1 sm:mt-2">Instagram</p>
            </a>
            <a href="https://www.tiktok.com/@nature.harvest" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Music2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 group-hover:text-green-600" />
              </div>
              <p className="text-xs font-jost text-white mt-1 sm:mt-2">TikTok</p>
            </a>
            <a href="https://twitter.com/NatureHarvest" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 group-hover:text-green-600" />
              </div>
              <p className="text-xs font-jost text-white mt-1 sm:mt-2">X</p>
            </a>
            <a href="https://www.linkedin.com/company/natureharvest/" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <div className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 group-hover:text-green-600 font-bold text-xs sm:text-sm flex items-center justify-center">in</div>
              </div>
              <p className="text-xs font-jost text-white mt-1 sm:mt-2">LinkedIn</p>
            </a>
            <a href="https://www.youtube.com/channel/natureharvest/" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 group-hover:text-green-600" />
              </div>
              <p className="text-xs font-jost text-white mt-1 sm:mt-2">YouTube</p>
            </a>
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-white mb-4 sm:mb-6"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs sm:text-sm font-jost text-white mb-1">
            Copyright © 2025 Nature Harvest. All rights reserved.
          </p>
          <p className="text-xs font-jost text-white">
            Crafted with ❤️ for healthy living
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 