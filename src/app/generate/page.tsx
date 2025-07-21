'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function GeneratePage() {
  const [documentType, setDocumentType] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedDocument, setGeneratedDocument] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push('/login')
    return null
  }

  const handleGenerate = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType, details, userId: user.id })
      })

      const { document } = await response.json()
      setGeneratedDocument(document)
    } catch (error) {
      console.error('Error generating document:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedDocument], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${documentType.replace(/\\s+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Generate Legal Document</h1>
          <p className="text-xl text-blue-200">AI-powered legal document creation</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Document Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select document type</option>
                  <option value="Non-Disclosure Agreement">Non-Disclosure Agreement</option>
                  <option value="Employment Contract">Employment Contract</option>
                  <option value="Service Agreement">Service Agreement</option>
                  <option value="Rental Agreement">Rental Agreement</option>
                  <option value="Partnership Agreement">Partnership Agreement</option>
                  <option value="Terms of Service">Terms of Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the specifics of your document..."
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!documentType || loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Document'}
              </button>
            </div>
          </div>

          {/* Generated Document */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Generated Document</h2>
              {generatedDocument && (
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                >
                  Download
                </button>
              )}
            </div>
            
            {generatedDocument ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {generatedDocument}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-96 flex items-center justify-center">
                <p className="text-gray-500">Your generated document will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}