'use client'

import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Music2 } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="relative bg-green-500 py-12 overflow-hidden">
      {/* Decorative leaves - top right */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-60">
        <div className="w-full h-full bg-black rounded-full transform rotate-45"></div>
        <div className="absolute top-3 right-3 w-12 h-12 bg-gray-800 rounded-full transform -rotate-12"></div>
      </div>
      
      {/* Decorative leaves - bottom left */}
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-60">
        <div className="w-full h-full bg-black rounded-full transform -rotate-45"></div>
        <div className="absolute bottom-3 left-3 w-12 h-12 bg-gray-800 rounded-full transform rotate-12"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
     
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Company Description */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-jost font-bold text-white mb-4">About Us</h3>
            <p className="text-base font-jost text-white leading-relaxed">
              We're committed to bringing you the highest quality organic juices while preserving 
              the environment for future generations. Every sip brings you closer to nature's purest flavors.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-jost font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <a href="#products" className="text-base font-jost text-white hover:text-green-100 transition-colors duration-300">
                  Our Products
                </a>
              </li>
              <li>
                <a href="#about" className="text-base font-jost text-white hover:text-green-100 transition-colors duration-300">
                  About Nature Harvest
                </a>
              </li>
              <li>
                <a href="#contact" className="text-base font-jost text-white hover:text-green-100 transition-colors duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#quality" className="text-base font-jost text-white hover:text-green-100 transition-colors duration-300">
                  Quality Assurance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-jost font-bold text-white mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start text-white">
                <MapPin className="h-4 w-4 mr-2 text-white" />
                <span className="text-base font-jost">Lahore, Pakistan</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-white">
                <Phone className="h-4 w-4 mr-2 text-white" />
                <span className="text-base font-jost">+92 325 413 1111</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-white">
                <Mail className="h-4 w-4 mr-2 text-white" />
                <span className="text-base font-jost">info@natureharvest.com.pk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-jost font-bold text-white mb-6">Connect With Us</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://www.facebook.com/natureharvest.pk" className="group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Facebook className="w-6 h-6 text-green-500 group-hover:text-green-600" />
              </div>
              <p className="text-xs font-jost text-white mt-2">Facebook</p>
            </a>
            <a href="https://www.instagram.com/natureharvest.pk/" className="group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Instagram className="w-6 h-6 text-green-500 group-hover:text-green-600" />
              </div>
              <p className="text-xs font-jost text-white mt-2">Instagram</p>
            </a>
            <a href="https://www.tiktok.com/@nature.harvest" className="group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Music2 className="w-6 h-6 text-green-500 group-hover:text-green-600" />
              </div>
              <p className="text-xs font-jost text-white mt-2">TikTok</p>
            </a>
            <a href="https://twitter.com/NatureHarvest" className="group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Twitter className="w-6 h-6 text-green-500 group-hover:text-green-600" />
              </div>
              <p className="text-xs font-jost text-white mt-2">X</p>
            </a>
            <a href="https://www.linkedin.com/company/natureharvest/" className="group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <div className="w-6 h-6 text-green-500 group-hover:text-green-600 font-bold text-sm flex items-center justify-center">in</div>
              </div>
              <p className="text-xs font-jost text-white mt-2">LinkedIn</p>
            </a>
            <a href="https://www.youtube.com/channel/natureharvest/" className="group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-green-100 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Youtube className="w-6 h-6 text-green-500 group-hover:text-green-600" />
              </div>
              <p className="text-xs font-jost text-white mt-2">YouTube</p>
            </a>
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-white mb-6"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm font-jost text-white mb-1">
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