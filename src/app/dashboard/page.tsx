'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<{
    documents_remaining: number
    subscription_type: string
  } | null>(null)
  const [documents, setDocuments] = useState<{
    id: string
    document_type: string
    generated_at: string
  }[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Fetch user profile
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(data)
    }

    // Fetch user documents
    const fetchDocuments = async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false })
        .limit(10)
      setDocuments(data || [])
    }

    fetchProfile()
    fetchDocuments()
  }, [user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user || !profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Documents Remaining</h3>
            <p className="text-3xl font-bold text-blue-600">{profile.documents_remaining}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Plan</h3>
            <p className="text-3xl font-bold text-green-600 capitalize">{profile.subscription_type}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Documents Generated</h3>
            <p className="text-3xl font-bold text-purple-600">{documents.length}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/generate"
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 text-center block"
          >
            <h3 className="text-xl font-bold mb-2">Generate New Document</h3>
            <p>Create a new legal document with AI</p>
          </Link>
          
          <Link
            href="/pricing"
            className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 text-center block"
          >
            <h3 className="text-xl font-bold mb-2">Upgrade Plan</h3>
            <p>Get more documents and features</p>
          </Link>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Documents</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div key={doc.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{doc.document_type}</h4>
                      <p className="text-sm text-gray-500">
                        Generated {new Date(doc.generated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Download
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">
                No documents generated yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}