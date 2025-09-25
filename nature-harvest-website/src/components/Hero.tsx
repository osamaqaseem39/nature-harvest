'use client'

import Image from 'next/image'
import Header from './Header'
import { useEffect, useRef, useState } from 'react'

const Hero = () => {
  const leaf1Ref = useRef<HTMLDivElement>(null)
  const leaf2Ref = useRef<HTMLDivElement>(null)
  const leaf3Ref = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts with a slight delay for smoothness
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 200)

    return () => clearTimeout(timer)
  }, [])

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

  return (
    <section className="relative min-h-screen sm:h-[1080px] bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("/images/herobg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Background overlay for text prominence */}
      <div className="absolute inset-0 bg-white/30 z-0"></div>

      {/* Header - Only for Home Page */}
      <Header />
      
      {/* Content will go here */}
  <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-50">
        <div className="flex flex-col items-center text-center justify-center min-h-[calc(100vh-80px)] sm:min-h-0">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] font-gazpacho font-bold text-[#292929] transition-all duration-1500 ease-out px-4 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            Welcome to <span className="text-green-600 transition-all duration-300 hover:text-green-700 hover:scale-105 inline-block">Nature</span> Harvest
          </h1>
          
          {/* Subheading */}
          <h2 className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] font-jost font-normal text-black max-w-3xl text-center leading-relaxed transition-all duration-1500 ease-out delay-400 px-4 mt-4 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          Experience the authentic taste of nature&apos;s finest fruits. Every bottle is crafted with care, bringing you the purest flavors without compromise.
          </h2>
          
          {/* Div with background image - Smooth animated from top */}
          <div 
            className={`relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[760px] xl:h-[760px] mb-8 mt-8 sm:mt-16 bg-center bg-no-repeat flex items-center justify-center z-20 transition-all duration-2000 ease-out delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-32'
            }`} 
            style={{ backgroundImage: 'url("/images/heroimagebg.png")', backgroundSize: '100%' }}
          >
            {/* Decorative Leaf Images positioned around this div - Only cursor reactive */}
            {/* Leaf 1 - Top Left of image div */}
            <div ref={leaf1Ref} className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 lg:-top-8 lg:-left-8 z-30 transition-all duration-500 ease-out">
              <Image
                src="/images/leaf1.png"
                alt="Decorative Leaf"
                width={60}
                height={60}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-[120px] xl:h-[120px] object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Leaf 2 - Right Center of image div */}
            <div ref={leaf2Ref} className="absolute top-1/2 -right-4 sm:-right-6 lg:-right-8 transform -translate-y-1/2 z-30 transition-all duration-500 ease-out">
              <Image
                src="/images/leaf2.png"
                alt="Decorative Leaf"
                width={60}
                height={60}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-[120px] xl:h-[120px] object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Leaf 3 - Bottom Center of image div */}
            <div ref={leaf3Ref} className="absolute -bottom-4 sm:-bottom-6 lg:-bottom-8 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-500 ease-out">
              <Image
                src="/images/leaf3.png"
                alt="Decorative Leaf"
                width={60}
                height={60}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-[120px] xl:h-[120px] object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Hero image inside the div - No hover effects */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1500 ease-out delay-800 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
              <Image
                src="/images/heroimage.png"
                alt="Nature Harvest Hero"
                width={760}
                height={760}
                className="w-full h-full object-cover drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 