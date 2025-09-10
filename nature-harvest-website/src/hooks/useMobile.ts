'use client'

import { useState, useEffect } from 'react'

interface MobileState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
  orientation: 'portrait' | 'landscape'
  isTouchDevice: boolean
}

export const useMobile = (): MobileState => {
  const [mobileState, setMobileState] = useState<MobileState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'portrait',
    isTouchDevice: false,
  })

  useEffect(() => {
    const updateMobileState = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setMobileState({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
        screenHeight: height,
        orientation: width > height ? 'landscape' : 'portrait',
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      })
    }

    // Initial check
    updateMobileState()

    // Add event listener for resize
    window.addEventListener('resize', updateMobileState)
    window.addEventListener('orientationchange', updateMobileState)

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateMobileState)
      window.removeEventListener('orientationchange', updateMobileState)
    }
  }, [])

  return mobileState
}

// Hook for mobile-specific animations
export const useMobileAnimations = () => {
  const { isMobile, isTouchDevice } = useMobile()
  
  const shouldReduceMotion = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  }

  const getAnimationProps = (baseProps: any) => {
    if (isMobile || shouldReduceMotion()) {
      return {
        ...baseProps,
        duration: 0.3, // Shorter animations on mobile
        ease: 'easeOut',
      }
    }
    return baseProps
  }

  const getHoverProps = () => {
    if (isTouchDevice) {
      return {
        whileTap: { scale: 0.95 },
        transition: { duration: 0.1 },
      }
    }
    return {
      whileHover: { scale: 1.05 },
      transition: { duration: 0.2 },
    }
  }

  return {
    isMobile,
    isTouchDevice,
    shouldReduceMotion: shouldReduceMotion(),
    getAnimationProps,
    getHoverProps,
  }
}

// Hook for mobile-specific layout
export const useMobileLayout = () => {
  const { isMobile, isTablet, screenWidth } = useMobile()
  
  const getGridCols = (mobile: number, tablet: number, desktop: number) => {
    if (isMobile) return mobile
    if (isTablet) return tablet
    return desktop
  }

  const getSpacing = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile
    if (isTablet) return tablet
    return desktop
  }

  const getTextSize = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile
    if (isTablet) return tablet
    return desktop
  }

  const getPadding = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile
    if (isTablet) return tablet
    return desktop
  }

  const getMargin = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile
    if (isTablet) return tablet
    return desktop
  }

  return {
    isMobile,
    isTablet,
    screenWidth,
    getGridCols,
    getSpacing,
    getTextSize,
    getPadding,
    getMargin,
  }
}

// Hook for mobile-specific interactions
export const useMobileInteractions = () => {
  const { isMobile, isTouchDevice } = useMobile()
  
  const handleTouchStart = (callback: () => void) => {
    if (isTouchDevice) {
      return callback
    }
    return undefined
  }

  const handleTouchEnd = (callback: () => void) => {
    if (isTouchDevice) {
      return callback
    }
    return undefined
  }

  const getTouchProps = (onTouchStart?: () => void, onTouchEnd?: () => void) => {
    if (!isTouchDevice) return {}
    
    return {
      onTouchStart: onTouchStart ? handleTouchStart(onTouchStart) : undefined,
      onTouchEnd: onTouchEnd ? handleTouchEnd(onTouchEnd) : undefined,
    }
  }

  const getSwipeProps = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
    if (!isTouchDevice) return {}
    
    let startX = 0
    let startY = 0
    
    const handleTouchStart = (e: React.TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    
    const handleTouchEnd = (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const diffX = startX - endX
      const diffY = startY - endY
      
      // Only trigger if horizontal swipe is greater than vertical
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50 && onSwipeLeft) {
          onSwipeLeft()
        } else if (diffX < -50 && onSwipeRight) {
          onSwipeRight()
        }
      }
    }
    
    return {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    }
  }

  return {
    isMobile,
    isTouchDevice,
    getTouchProps,
    getSwipeProps,
  }
}

export default useMobile