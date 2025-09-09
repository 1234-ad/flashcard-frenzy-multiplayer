'use client'
import { useState, useEffect } from 'react'
import { getCurrentUser, signOut } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [roomId, setRoomId] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const createGame = async () => {
    const newRoomId = uuidv4()
    window.location.href = `/game/${newRoomId}`
  }

  const joinGame = () => {
    if (roomId.trim()) {
      window.location.href = `/game/${roomId.trim()}`
    } else {
      alert('Please enter a valid room ID')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="card">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🎯 Flashcard Frenzy
              </h1>
              <p className="text-lg text-gray-600">
                Race against friends to answer flashcards correctly!
              </p>
            </div>
            
            <div className="space-y-4">
              <a
                href="/login"
                className="block w-full btn-primary text-center py-3 text-lg"
              >
                Login to Play
              </a>
              
              <p className="text-sm text-gray-500">
                Don't have an account? Sign up when you login!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎯 Flashcard Frenzy
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Race against friends to answer flashcards correctly!
          </p>
          <p className="text-gray-500">
            Welcome back, <span className="font-semibold">{user.email}</span>!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-center">Create Game</h2>
            <p className="text-gray-600 mb-6 text-center">
              Start a new game and invite a friend to join
            </p>
            <button
              onClick={createGame}
              className="w-full btn-success py-4 text-lg"
            >
              🚀 Create New Game
            </button>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-center">Join Game</h2>
            <p className="text-gray-600 mb-4 text-center">
              Enter a room ID to join an existing game
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID..."
                className="input-field"
                onKeyPress={(e) => e.key === 'Enter' && joinGame()}
              />
              <button
                onClick={joinGame}
                disabled={!roomId.trim()}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎮 Join Game
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="card max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Game Features</h3>
            <ul className="text-left space-y-2 text-gray-600">
              <li>✅ Real-time multiplayer racing</li>
              <li>✅ Screen reader accessibility</li>
              <li>✅ Match history tracking</li>
              <li>✅ Instant feedback on answers</li>
              <li>✅ Mobile-friendly design</li>
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <a
                href="/history"
                className="block w-full btn-secondary py-2"
              >
                📊 View Game History
              </a>
              
              <button
                onClick={handleSignOut}
                className="w-full text-red-600 hover:text-red-800 py-2 text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}