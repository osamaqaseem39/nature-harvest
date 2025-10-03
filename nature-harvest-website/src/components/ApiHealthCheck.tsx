'use client'

import { useEffect, useState } from 'react'
import { apiService } from '../lib/api'

const ApiHealthCheck = () => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking')
  const [details, setDetails] = useState<string>('')

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setStatus('checking')
        setDetails('Checking API connection...')
        
        // Test multiple endpoints
        const [brandsResponse, productsResponse] = await Promise.allSettled([
          apiService.getBrands(),
          apiService.getProducts({ limit: 1 })
        ])
        
        const brandsOk = brandsResponse.status === 'fulfilled' && brandsResponse.value?.data?.length > 0
        const productsOk = productsResponse.status === 'fulfilled' && productsResponse.value?.data?.length > 0
        
        if (brandsOk && productsOk) {
          setStatus('healthy')
          setDetails(`✅ API Healthy - Brands: ${brandsResponse.value?.data?.length || 0}, Products: ${productsResponse.value?.data?.length || 0}`)
        } else {
          setStatus('unhealthy')
          setDetails(`❌ API Issues - Brands: ${brandsOk ? 'OK' : 'Failed'}, Products: ${productsOk ? 'OK' : 'Failed'}`)
        }
      } catch (error) {
        setStatus('unhealthy')
        setDetails(`❌ API Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    checkApiHealth()
  }, [])

  if (status === 'checking') {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg text-sm z-50">
        🔄 Checking API...
      </div>
    )
  }

  if (status === 'unhealthy') {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm z-50 max-w-sm">
        {details}
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm z-50">
      {details}
    </div>
  )
}

export default ApiHealthCheck
