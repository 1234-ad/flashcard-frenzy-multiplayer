'use client'
import { useState, useEffect } from 'react'
import { getGameHistory } from '../lib/mongodb'

export default function GameHistory({ userId }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (userId) {
      fetchHistory()
    }
  }, [userId])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/game-history?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
      } else {
        setError('Failed to load game history')
      }
    } catch (err) {
      setError('Error loading game history')
      console.error('Error fetching history:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${remainingSeconds}s`
  }

  const getGameResult = (game, userId) => {
    if (!game.winner) return 'Tie'
    return game.winner.id === userId ? 'Won' : 'Lost'
  }

  const getResultColor = (result) => {
    switch (result) {
      case 'Won': return 'text-green-600 bg-green-50 border-green-200'
      case 'Lost': return 'text-red-600 bg-red-50 border-red-200'
      case 'Tie': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getOpponentName = (game, userId) => {
    const opponent = game.player1?.id === userId ? game.player2 : game.player1
    return opponent?.name || opponent?.email?.split('@')[0] || 'Unknown Player'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="card text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">Error Loading History</p>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchHistory}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="card text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Games Yet</h3>
          <p className="text-gray-500 mb-6">
            You haven't played any games yet. Start your first flashcard battle!
          </p>
          <a
            href="/"
            className="btn-primary"
          >
            🚀 Play Your First Game
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Game History</h2>
        <div className="text-sm text-gray-500">
          {history.length} game{history.length !== 1 ? 's' : ''} played
        </div>
      </div>

      {history.map((game, index) => {
        const result = getGameResult(game, userId)
        const opponentName = getOpponentName(game, userId)
        const userScore = game.player1?.id === userId ? game.scores[game.player1.id] : game.scores[game.player2?.id]
        const opponentScore = game.player1?.id === userId ? game.scores[game.player2?.id] : game.scores[game.player1.id]

        return (
          <div key={game._id || index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getResultColor(result)}`}>
                  {result === 'Won' ? '🏆 Won' : result === 'Lost' ? '😔 Lost' : '🤝 Tie'}
                </span>
                <span className="text-gray-600">vs {opponentName}</span>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(game.completedAt || game.createdAt)}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Your Score:</span>
                <div className="font-semibold text-lg">{userScore || 0}</div>
              </div>
              <div>
                <span className="text-gray-500">Opponent Score:</span>
                <div className="font-semibold text-lg">{opponentScore || 0}</div>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <div className="font-semibold">{formatDuration(game.duration || 0)}</div>
              </div>
              <div>
                <span className="text-gray-500">Questions:</span>
                <div className="font-semibold">{game.totalCards || 0}</div>
              </div>
            </div>

            {game.winner && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🎯</span>
                  <span>
                    {game.winner.id === userId ? 'You' : opponentName} won with {game.scores[game.winner.id]} correct answers
                  </span>
                </div>
              </div>
            )}
          </div>
        )
      })}

      <div className="text-center pt-6">
        <button
          onClick={fetchHistory}
          className="btn-secondary"
        >
          🔄 Refresh History
        </button>
      </div>
    </div>
  )
}