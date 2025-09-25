'use client'

import { ReactNode } from 'react'
import { useMobile } from '../hooks/useMobile'

interface MobileLayoutProps {
  children: ReactNode
  className?: string
}

const MobileLayout = ({ children, className = '' }: MobileLayoutProps) => {
  const { isMobile, isTablet } = useMobile()

  const getContainerClass = () => {
    if (isMobile) {
      return 'px-4 py-2'
    }
    if (isTablet) {
      return 'px-6 py-4'
    }
    return 'px-8 py-6'
  }

  const getMaxWidthClass = () => {
    if (isMobile) {
      return 'max-w-full'
    }
    if (isTablet) {
      return 'max-w-4xl'
    }
    return 'max-w-[1200px]'
  }

  return (
    <div className={`${getMaxWidthClass()} mx-auto ${getContainerClass()} ${className}`}>
      {children}
    </div>
  )
}

// Mobile-specific section wrapper
export const MobileSection = ({ 
  children, 
  className = '',
  padding = 'default'
}: {
  children: ReactNode
  className?: string
  padding?: 'none' | 'small' | 'default' | 'large'
}) => {
  const { isMobile, isTablet } = useMobile()

  const getPaddingClass = () => {
    if (padding === 'none') return ''
    if (padding === 'small') {
      return isMobile ? 'py-8' : isTablet ? 'py-12' : 'py-16'
    }
    if (padding === 'large') {
      return isMobile ? 'py-16' : isTablet ? 'py-20' : 'py-24'
    }
    // default
    return isMobile ? 'py-12' : isTablet ? 'py-16' : 'py-20'
  }

  return (
    <section className={`${getPaddingClass()} ${className}`}>
      {children}
    </section>
  )
}

// Mobile-specific grid component
export const MobileGrid = ({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'default',
  className = ''
}: {
  children: ReactNode
  cols?: { mobile: number; tablet: number; desktop: number }
  gap?: 'small' | 'default' | 'large'
  className?: string
}) => {
  const { isMobile, isTablet } = useMobile()

  const getGridCols = () => {
    if (isMobile) return `grid-cols-${cols.mobile}`
    if (isTablet) return `grid-cols-${cols.tablet}`
    return `grid-cols-${cols.desktop}`
  }

  const getGapClass = () => {
    if (gap === 'small') {
      return isMobile ? 'gap-3' : isTablet ? 'gap-4' : 'gap-6'
    }
    if (gap === 'large') {
      return isMobile ? 'gap-6' : isTablet ? 'gap-8' : 'gap-12'
    }
    // default
    return isMobile ? 'gap-4' : isTablet ? 'gap-6' : 'gap-8'
  }

  return (
    <div className={`grid ${getGridCols()} ${getGapClass()} ${className}`}>
      {children}
    </div>
  )
}

// Mobile-specific text component
export const MobileText = ({ 
  children, 
  size = 'base',
  weight = 'normal',
  color = 'default',
  className = ''
}: {
  children: ReactNode
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'primary' | 'secondary'
  className?: string
}) => {
  const { isMobile, isTablet } = useMobile()

  const getSizeClass = () => {
    const sizeMap = {
      xs: isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm',
      sm: isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-base',
      base: isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-lg',
      lg: isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-xl',
      xl: isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-2xl',
      '2xl': isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-3xl',
      '3xl': isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-4xl',
      '4xl': isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-5xl',
      '5xl': isMobile ? 'text-5xl' : isTablet ? 'text-6xl' : 'text-6xl',
    }
    return sizeMap[size]
  }

  const getWeightClass = () => {
    const weightMap = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    }
    return weightMap[weight]
  }

  const getColorClass = () => {
    const colorMap = {
      default: 'text-gray-800',
      muted: 'text-gray-600',
      primary: 'text-green-600',
      secondary: 'text-green-500',
    }
    return colorMap[color]
  }

  return (
    <div className={`${getSizeClass()} ${getWeightClass()} ${getColorClass()} ${className}`}>
      {children}
    </div>
  )
}

// Mobile-specific button component
export const MobileButton = ({ 
  children, 
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  className = '',
  onClick,
  disabled = false
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  fullWidth?: boolean
  className?: string
  onClick?: () => void
  disabled?: boolean
}) => {
  const { isMobile } = useMobile()

  const getVariantClass = () => {
    const variantMap = {
      primary: 'bg-green-500 hover:bg-green-600 text-white',
      secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
      outline: 'border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
      ghost: 'text-green-500 hover:bg-green-50',
    }
    return variantMap[variant]
  }

  const getSizeClass = () => {
    if (size === 'sm') {
      return isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base'
    }
    if (size === 'lg') {
      return isMobile ? 'px-6 py-3 text-lg' : 'px-8 py-4 text-xl'
    }
    // default
    return isMobile ? 'px-4 py-2 text-base' : 'px-6 py-3 text-lg'
  }

  const getWidthClass = () => {
    return fullWidth ? 'w-full' : ''
  }

  const baseClass = 'font-jost font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'

  return (
    <button
      className={`${baseClass} ${getVariantClass()} ${getSizeClass()} ${getWidthClass()} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default MobileLayout