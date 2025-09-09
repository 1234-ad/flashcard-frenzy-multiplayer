'use client'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../../../lib/supabase'
import GameBoard from '../../../components/GameBoard'

export default function GamePage({ params }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [roomId, setRoomId] = useState(null)

  useEffect(() => {
    // Extract roomId from params
    const extractRoomId = async () => {
      const resolvedParams = await params
      setRoomId(resolvedParams.roomId)
    }
    
    extractRoomId()
    checkUser()
  }, [params])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        // Redirect to login if not authenticated
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

  if (loading || !roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
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
            You need to be logged in to play Flashcard Frenzy.
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

  return <GameBoard roomId={roomId} user={user} />
}