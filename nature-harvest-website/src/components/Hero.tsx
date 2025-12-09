'use client'

import Image from 'next/image'
import Header from './Header'
import { useEffect, useRef, useState } from 'react'

const Hero = () => {
  const leaf1Ref = useRef<HTMLDivElement>(null)
  const leaf2Ref = useRef<HTMLDivElement>(null)
  const leaf3Ref = useRef<HTMLDivElement>(null)
  const heroImageRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  
  // Hero images array
  const heroImages = [
    '/images/heroimage.png',
    '/images/heroimage2.png'
  ]

  useEffect(() => {
    // Trigger animation after component mounts with a slight delay for smoothness
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  // Auto-slide hero images
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 6000) // Change image every 6 seconds

    return () => clearInterval(slideInterval)
  }, [heroImages.length])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const leaves = [leaf1Ref.current, leaf2Ref.current, leaf3Ref.current]
      
      leaves.forEach((leaf) => {
        if (leaf) {
          const rect = leaf.getBoundingClientRect()
          const leafCenterX = rect.left + rect.width / 2
          const leafCenterY = rect.top + rect.height / 2
          
          const mouseX = e.clientX
          const mouseY = e.clientY
          
          const distanceX = mouseX - leafCenterX
          const distanceY = mouseY - leafCenterY
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
          
          if (distance < 400) { // Repulsion radius
            const force = (400 - distance) / 400 // Stronger force when closer
            const moveX = (distanceX / distance) * force * 15
            const moveY = (distanceY / distance) * force * 15
            
            leaf.style.transform = `translate(${-moveX}px, ${-moveY}px)`
          } else {
            leaf.style.transform = 'translate(0px, 0px)'
          }
        }
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // 3D tilt effect for hero image on hover
  useEffect(() => {
    const heroContainer = heroImageRef.current
    if (!heroContainer) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroContainer.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY
      
      // Calculate tilt values (max 15 degrees)
      const tiltX = (mouseY / (rect.height / 2)) * -15
      const tiltY = (mouseX / (rect.width / 2)) * 15
      
      setTilt({ x: tiltX, y: tiltY })
    }

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 })
    }

    heroContainer.addEventListener('mousemove', handleMouseMove)
    heroContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      heroContainer.removeEventListener('mousemove', handleMouseMove)
      heroContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section className="relative min-h-screen sm:h-[1080px] bg-contain bg-no-repeat bg-center isolate" style={{ backgroundImage: 'url("/images/herobg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Background overlay for text prominence */}
      <div className="absolute inset-0 bg-white/30 z-0"></div>

      {/* Header - Only for Home Page */}
      <Header />
      
      {/* Content will go here */}
  <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <div className="flex flex-col items-center text-center justify-center min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-100px)]">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-gazpacho font-bold text-[#292929] transition-all duration-1500 ease-out px-4 whitespace-nowrap pt-8 sm:pt-12 md:pt-16 lg:pt-20 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            Welcome to <span className="text-green-600 transition-all duration-300 hover:text-green-700 hover:scale-105 inline-block">Nature</span> Harvest
          </h1>
          
          {/* Subheading */}
          <h2 className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] font-jost font-normal text-black max-w-3xl text-center leading-relaxed transition-all duration-1500 ease-out delay-400 px-4 mt-2 sm:mt-2 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          Experience the authentic taste of nature&apos;s finest <span className="text-green-600 font-semibold transition-all duration-300 hover:text-green-700">juice</span>, <span className="text-green-600 font-semibold transition-all duration-300 hover:text-green-700">premium flavored milk</span>, and <span className="text-green-600 font-semibold transition-all duration-300 hover:text-green-700">quality tea whiteners</span>. Every product is crafted with care, bringing you the purest flavors without compromise.
          </h2>
          
          {/* Div with background image - Smooth animated from top */}
          <div 
            ref={heroImageRef}
            className={`relative w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] xl:w-[520px] xl:h-[520px] mb-6 mt-2 sm:mt-3 bg-center bg-no-repeat flex items-center justify-center z-10 transition-all duration-2000 ease-out delay-600 group cursor-pointer overflow-visible ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-32'
            }`} 
            style={{ 
              backgroundImage: 'url("/images/heroimagebg.png")', 
              backgroundSize: '100%',
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Decorative Leaf Images positioned around this div - Only cursor reactive */}
            {/* Leaf 1 - Top Left of image div */}
            <div ref={leaf1Ref} className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 lg:-top-6 lg:-left-6 z-30 transition-all duration-500 ease-out">
              <Image
                src="/images/leaf1.png"
                alt="Decorative Leaf"
                width={50}
                height={50}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-[100px] xl:h-[100px] object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Leaf 2 - Right Center of image div */}
            <div ref={leaf2Ref} className="absolute top-1/2 -right-3 sm:-right-4 lg:-right-6 transform -translate-y-1/2 z-30 transition-all duration-500 ease-out">
              <Image
                src="/images/leaf2.png"
                alt="Decorative Leaf"
                width={50}
                height={50}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-[100px] xl:h-[100px] object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Leaf 3 - Bottom Center of image div */}
            <div ref={leaf3Ref} className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-6 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-500 ease-out">
              <Image
                src="/images/leaf3.png"
                alt="Decorative Leaf"
                width={50}
                height={50}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-[100px] xl:h-[100px] object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Hero images slider inside the div */}
            <div className="absolute inset-0 flex items-center justify-center overflow-visible">
              {heroImages.map((imageSrc, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-[3000ms] ease-in-out ${
                    index === currentImageIndex
                      ? 'opacity-100 z-10'
                      : 'opacity-0 z-0'
                  } ${
                    isLoaded ? '' : 'opacity-0'
                  }`}
                  style={{
                    transition: 'opacity 3s ease-in-out'
                  }}
                >
                  <Image
                    src={imageSrc}
                    alt={`Nature Harvest Hero ${index + 1}`}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110 group-hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 