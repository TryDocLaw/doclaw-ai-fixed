'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      router.push('/signup')
      return
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId: user.id })
    })

    const { sessionId } = await response.json()
    const stripe = await stripePromise
    
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId })
    }
  }

  const handleFreeTrial = () => {
    router.push('/generate')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-blue-200">Start generating legal documents today</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Trial */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Trial</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">Free</div>
              <div className="text-gray-600 mb-6">7 days, then $29/document</div>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  10 documents included
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  All document types
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Email support
                </li>
              </ul>

              <button
                onClick={handleFreeTrial}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Professional */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">$299</div>
              <div className="text-gray-600 mb-6">per month</div>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  100 documents/month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Advanced templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Analytics dashboard
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL!)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Subscribe Now
              </button>
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">$699</div>
              <div className="text-gray-600 mb-6">per month</div>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Unlimited documents
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  24/7 support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  White-label option
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE!)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}