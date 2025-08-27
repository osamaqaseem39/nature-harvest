'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const pathname = usePathname()
  
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default PageWrapper 