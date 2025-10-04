'use client'

import { useState } from 'react'
import { config } from '@/lib/config'

export default function UploadTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)
      console.log('Upload URL:', `${config.upload.baseUrl}${config.upload.endpoint}`)

      const response = await fetch(`${config.upload.baseUrl}${config.upload.endpoint}`, {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log('Raw response text:', responseText)

      let responseData
      try {
        responseData = JSON.parse(responseText)
        console.log('Parsed response:', responseData)
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError)
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      setResult(responseData)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Upload Response Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Test File Upload
          </h2>
          
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            
            {loading && (
              <div className="flex items-center text-green-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
                Uploading...
              </div>
            )}
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upload Response
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Success</h3>
                <p className="text-sm text-gray-900">{String(result.success)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Message</h3>
                <p className="text-sm text-gray-900">{result.message || 'No message'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Data Structure</h3>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
              
              {result.data?.urls && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">URLs Array</h3>
                  <ul className="text-sm text-gray-900">
                    {result.data.urls.map((url: string, index: number) => (
                      <li key={index} className="break-all">{url}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.data?.files && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Files Array</h3>
                  <ul className="text-sm text-gray-900">
                    {result.data.files.map((file: any, index: number) => (
                      <li key={index} className="break-all">
                        {file.filename}: {file.success ? 'Success' : 'Failed'} - {file.url || 'No URL'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
