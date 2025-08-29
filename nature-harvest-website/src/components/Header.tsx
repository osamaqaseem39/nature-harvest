'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect for floating header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Set loaded after a short delay to hide header during preloader
    const timer = setTimeout(() => setIsLoaded(true), 2000)
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [])

  // Don't render header until page is loaded
  if (!isLoaded) return null

  const navigation = [
    { name: 'Home', href: '/', active: pathname === '/' },
    { name: 'About', href: '/about', active: pathname === '/about' },
    { name: 'Brands', href: '/brands', active: pathname === '/brands' },
    { name: 'Products', href: '/products', active: pathname.startsWith('/products') },
    { name: 'Partner', href: '/partner', active: pathname === '/partner' },
    { name: 'Careers', href: '/careers', active: pathname === '/careers' },
  ]

  return (
    <header className={`fixed z-50 transition-all duration-500 ${
      isScrolled 
        ? 'top-2 left-4 right-4' 
        : 'top-4 left-4 right-4'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className={`mx-4 rounded-lg transition-all duration-500 ${
          isScrolled 
            ? 'bg-white backdrop-blur-md shadow-2xl border border-gray-100/30' 
            : 'bg-white backdrop-blur-sm shadow-lg border border-white/30'
        }`}>
          <div className="flex justify-between items-center h-[70px] lg:h-[90px] px-4 lg:px-12">
            {/* Logo */}
            <Link href="/" className="flex items-center z-10 px-2 lg:px-4 py-2">
              <Image
                src="/images/logo-full.png"
                alt="Nature Harvest Logo"
                width={160}
                height={36}
                priority
                className="w-32 lg:w-40 h-auto hover:opacity-80 transition-opacity duration-200"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-0">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`font-jost hover:text-green-500 px-5 py-3 text-lg font-medium transition-colors duration-200 whitespace-nowrap rounded-full hover:bg-gray-100/50 ${
                      item.active ? 'text-green-500' : 'text-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Contact Button */}
            <div className="hidden lg:block">
              <Link
                href="/contact"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl font-jost uppercase tracking-wide whitespace-nowrap hover:scale-110 transform"
              >
                CONTACT US
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-800 hover:text-yellow-300 p-2 lg:p-3 transition-colors duration-200 rounded-full hover:bg-gray-100/50"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 lg:h-6 lg:w-6" />
                ) : (
                  <Menu className="h-5 w-5 lg:h-6 lg:w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mx-4 mb-4">
              <div className="px-4 lg:px-6 pt-3 lg:pt-4 pb-4 lg:pb-6 space-y-1 lg:space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className={`text-gray-800 hover:text-green-500 block px-3 lg:px-4 py-2 lg:py-3 text-base font-medium transition-colors duration-200 font-jost rounded-lg hover:bg-gray-50 ${
                        item.active ? 'text-green-500' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
                
                {/* Mobile Contact Button */}
                <div className="pt-3 lg:pt-4">
                  <Link
                    href="/contact"
                    className="bg-green-500 hover:bg-green-600 text-white block px-4 py-3 rounded-full text-base font-bold transition-all duration-200 text-center font-jost uppercase tracking-wide"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    CONTACT US
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header 