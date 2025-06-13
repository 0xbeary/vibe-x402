'use client'

import { useState } from 'react'
import { privateKeyToAccount } from 'viem/accounts'
import { wrapFetchWithPayment } from 'x402-fetch'

// You'll need to set this in your environment variables
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5678'

interface ApiResponse {
  data?: string
  timestamp?: string
  message?: string
  error?: string
}

export default function Home() {
  const [freeResult, setFreeResult] = useState<ApiResponse | null>(null)
  const [paidResult, setPaidResult] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState({ free: false, paid: false })
  const [walletReady, setWalletReady] = useState(false)

  // Initialize wallet/account for payments
  const initializeAccount = () => {
    if (!PRIVATE_KEY) {
      alert('Please set NEXT_PUBLIC_PRIVATE_KEY in your environment variables')
      return null
    }

    try {
      const account = privateKeyToAccount(PRIVATE_KEY)
      setWalletReady(true)
      return account
    } catch (error) {
      console.error('Failed to initialize account:', error)
      alert('Failed to initialize wallet. Check your private key.')
      return null
    }
  }

  // Test free endpoint
  const testFreeEndpoint = async () => {
    setLoading(prev => ({ ...prev, free: true }))
    setFreeResult(null)
    
    try {
      const response = await fetch(`${BACKEND_URL}/`)
      const data = await response.text()
      setFreeResult({ data, message: 'Free endpoint accessed successfully!' })
    } catch (error) {
      setFreeResult({ error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setLoading(prev => ({ ...prev, free: false }))
    }
  }

  // Test paid endpoint using x402-fetch
  const testPaidEndpoint = async () => {
    setLoading(prev => ({ ...prev, paid: true }))
    setPaidResult(null)
    
    const account = initializeAccount()
    if (!account) {
      setLoading(prev => ({ ...prev, paid: false }))
      return
    }

    try {
      // Create x402-enabled fetch client
      const paymentFetch = wrapFetchWithPayment(fetch, account)
      
      // Make request to paid endpoint
      const response = await paymentFetch(`${BACKEND_URL}/protected`, {
        method: 'GET'
      })
      
      if (response.ok) {
        const data = await response.json() as ApiResponse
        setPaidResult(data)
      } else {
        const errorText = await response.text()
        setPaidResult({ error: `HTTP ${response.status}: ${errorText}` })
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaidResult({ error: `Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setLoading(prev => ({ ...prev, paid: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            x402 Payment Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the x402 payment protocol with both free and paid endpoints. 
            The paid endpoint requires USDC payment on Base Sepolia testnet.
          </p>
        </div>

        {/* Wallet Status */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-2">Wallet Status</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${walletReady ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={`text-sm ${walletReady ? 'text-green-700' : 'text-gray-500'}`}>
              {walletReady ? 'Wallet Ready' : 'Wallet Not Initialized'}
            </span>
          </div>
          {PRIVATE_KEY && (
            <p className="text-xs text-gray-500 mt-1">
              Private key configured (Base Sepolia)
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Endpoint Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Free Endpoint
              </h2>
              <p className="text-gray-600">
                Test the root endpoint that doesn&apos;t require payment.
              </p>
            </div>
            
            <button
              onClick={testFreeEndpoint}
              disabled={loading.free}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading.free ? 'Testing...' : 'Test Free Endpoint'}
            </button>
            
            {freeResult && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Response:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {freeResult.error ? (
                    <p className="text-red-600 text-sm font-mono">{freeResult.error}</p>
                  ) : (
                    <div className="space-y-2">
                      {freeResult.data && (
                        <p className="text-green-700 text-sm font-mono">{freeResult.data}</p>
                      )}
                      {freeResult.message && (
                        <p className="text-blue-600 text-sm">{freeResult.message}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Paid Endpoint Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Paid Endpoint
              </h2>
              <p className="text-gray-600">
                Test the protected endpoint that requires $0.001 USDC payment.
              </p>
            </div>
            
            <button
              onClick={testPaidEndpoint}
              disabled={loading.paid || !PRIVATE_KEY}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading.paid ? 'Processing Payment...' : 'Test Paid Endpoint ($0.001)'}
            </button>
            
            {!PRIVATE_KEY && (
              <p className="mt-2 text-sm text-amber-600">
                Set NEXT_PUBLIC_PRIVATE_KEY to test payments
              </p>
            )}
            
            {paidResult && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Response:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {paidResult.error ? (
                    <p className="text-red-600 text-sm font-mono">{paidResult.error}</p>
                  ) : (
                    <div className="space-y-2">
                      {paidResult.data && (
                        <p className="text-green-700 text-sm font-mono">
                          <strong>Data:</strong> {paidResult.data}
                        </p>
                      )}
                      {paidResult.timestamp && (
                        <p className="text-gray-600 text-sm">
                          <strong>Timestamp:</strong> {paidResult.timestamp}
                        </p>
                      )}
                      {paidResult.message && (
                        <p className="text-blue-600 text-sm">
                          <strong>Status:</strong> {paidResult.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How to Use
          </h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900">1. Free Endpoint</h3>
              <p>Click &quot;Test Free Endpoint&quot; to make a request to the root path (/) that doesn&apos;t require payment.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">2. Paid Endpoint</h3>
              <p>Click &quot;Test Paid Endpoint&quot; to make a request to /protected that requires a $0.001 USDC payment on Base Sepolia.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">3. Setup Required</h3>
              <p>To test payments, you need:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>A private key with USDC on Base Sepolia testnet</li>
                <li>Set <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_PRIVATE_KEY</code> environment variable</li>
                <li>Make sure your backend is running on port 5678</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
