'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false)
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
    { name: 'About us', href: '/about', active: pathname === '/about' },
    { 
      name: 'Product', 
      href: '/products',
      active: pathname.startsWith('/products'),
      hasDropdown: true,
      dropdownItems: [
        { name: 'Fresh Juices', href: '/products/juices' },
        { name: 'Smoothies', href: '/products/smoothies' },
        { name: 'Organic Products', href: '/products/organic' }
      ]
    },
    { name: 'Contact us', href: '/contact', active: pathname === '/contact' },
    { 
      name: 'Pages', 
      href: '/pages',
      active: pathname.startsWith('/pages'),
      hasDropdown: true,
      dropdownItems: [
        { name: 'Blog', href: '/blog' },
        { name: 'Team', href: '/team' },
        { name: 'Careers', href: '/careers' }
      ]
    },
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
          <div className="flex justify-between items-center h-[90px] px-12">
            {/* Logo */}
            <Link href="/" className="flex items-center z-10 px-4 py-2">
              <Image
                src="/images/logo-full.png"
                alt="Nature Harvest Logo"
                width={160}
                height={36}
                priority
                className="hover:opacity-80 transition-opacity duration-200"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-0">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.hasDropdown ? (
                    <div className="relative">
                      <button
                        className={`flex items-center font-jost hover:text-green-500 px-5 py-3 text-lg font-medium transition-colors duration-200 whitespace-nowrap rounded-full hover:bg-gray-100/50 ${
                          item.active ? 'text-green-500' : 'text-gray-800'
                        }`}
                        onMouseEnter={() => item.name === 'Product' ? setProductDropdownOpen(true) : setPagesDropdownOpen(true)}
                        onMouseLeave={() => item.name === 'Product' ? setProductDropdownOpen(false) : setPagesDropdownOpen(false)}
                      >
                        {item.name}
                        <ChevronDown className="ml-1 h-5 w-5" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div
                        className={`absolute top-full left-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible transition-all duration-300 ${
                          (item.name === 'Product' && productDropdownOpen) || (item.name === 'Pages' && pagesDropdownOpen)
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible -translate-y-2'
                        }`}
                        onMouseEnter={() => item.name === 'Product' ? setProductDropdownOpen(true) : setPagesDropdownOpen(true)}
                        onMouseLeave={() => item.name === 'Product' ? setProductDropdownOpen(false) : setPagesDropdownOpen(false)}
                      >
                        <div className="py-3">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-jost rounded-lg mx-2"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`font-jost hover:text-green-500 px-5 py-3 text-lg font-medium transition-colors duration-200 whitespace-nowrap rounded-full hover:bg-gray-100/50 ${
                        item.active ? 'text-green-500' : 'text-gray-800'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Partnership Button */}
            <div className="hidden lg:block">
              <Link
                href="/partnership"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl font-jost uppercase tracking-wide whitespace-nowrap hover:scale-110 transform"
              >
                VIEW COLLECTION
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-800 hover:text-yellow-300 p-3 transition-colors duration-200 rounded-full hover:bg-gray-100/50"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mx-4 mb-4">
              <div className="px-6 pt-4 pb-6 space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          className="w-full text-left text-gray-800 hover:text-green-500 block px-4 py-3 text-base font-medium transition-colors duration-200 font-jost rounded-lg hover:bg-gray-50"
                          onClick={() => {
                            if (item.name === 'Product') setProductDropdownOpen(!productDropdownOpen)
                            if (item.name === 'Pages') setPagesDropdownOpen(!pagesDropdownOpen)
                          }}
                        >
                          <div className="flex items-center justify-between">
                            {item.name}
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                              (item.name === 'Product' && productDropdownOpen) || (item.name === 'Pages' && pagesDropdownOpen)
                                ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </button>
                        
                        {/* Mobile Dropdown */}
                        {((item.name === 'Product' && productDropdownOpen) || (item.name === 'Pages' && pagesDropdownOpen)) && (
                          <div className="pl-6 space-y-2">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="block px-4 py-2 text-sm text-gray-600 hover:text-green-500 transition-colors duration-200 font-jost rounded-lg hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`text-gray-800 hover:text-green-500 block px-4 py-3 text-base font-medium transition-colors duration-200 font-jost rounded-lg hover:bg-gray-50 ${
                          item.active ? 'text-green-500' : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile Partnership Button */}
                <div className="pt-4">
                  <Link
                    href="/partnership"
                    className="bg-green-500 hover:bg-green-600 text-white block px-4 py-3 rounded-full text-base font-bold transition-all duration-200 text-center font-jost uppercase tracking-wide"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    VIEW COLLECTION
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