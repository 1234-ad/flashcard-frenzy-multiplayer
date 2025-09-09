'use client'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../../lib/supabase'
import GameHistory from '../../components/GameHistory'

export default function HistoryPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        window.location.href = '/login'
        return
      }
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your game history...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your game history.
          </p>
          <a
            href="/login"
            className="btn-primary"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📊 Game History
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Track your flashcard battles and victories
          </p>
          <p className="text-gray-500">
            Welcome back, <span className="font-semibold">{user.email}</span>!
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="btn-primary text-center"
            >
              🏠 Back to Home
            </a>
            <a
              href="/"
              className="btn-success text-center"
            >
              🚀 Play New Game
            </a>
          </div>
        </div>

        <GameHistory userId={user.id} />
      </div>
    </div>
  )
}