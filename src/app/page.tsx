import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-2xl font-bold text-white">DocuLaws AI</div>
            <div className="space-x-4">
              <Link href="/login" className="text-white hover:text-blue-200">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            AI-Powered Legal
            <br />
            <span className="text-blue-400">Document Creation</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-200 mb-12 max-w-3xl mx-auto">
            Generate professional legal documents in minutes with our advanced AI.
            Save time, reduce costs, and ensure accuracy.
          </p>

          <div className="space-x-6">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 inline-block"
            >
              Start Free Trial
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-900 inline-block"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
            <p className="text-blue-200">
              Generate complex legal documents in under 2 minutes with our AI-powered system.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-4">Highly Accurate</h3>
            <p className="text-blue-200">
              Our AI is trained on thousands of legal documents to ensure accuracy and compliance.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-white mb-4">Cost Effective</h3>
            <p className="text-blue-200">
              Save thousands in legal fees with our affordable document generation platform.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}