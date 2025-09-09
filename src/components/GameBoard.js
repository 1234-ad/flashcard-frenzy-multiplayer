'use client'
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import FlashCard from './FlashCard'
import PlayerScore from './PlayerScore'
import AccessibilityAnnouncer from './AccessibilityAnnouncer'

export default function GameBoard({ roomId, user }) {
  const [socket, setSocket] = useState(null)
  const [gameState, setGameState] = useState({
    players: [],
    currentCard: null,
    scores: {},
    gameStatus: 'waiting',
    winner: null,
    currentCardIndex: 0,
    totalCards: 10
  })
  const [announcement, setAnnouncement] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [roomIdCopied, setRoomIdCopied] = useState(false)
  const gameStateRef = useRef(gameState)

  // Keep ref updated
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000', {
      transports: ['websocket', 'polling']
    })
    
    setSocket(newSocket)

    // Connection event handlers
    newSocket.on('connect', () => {
      setConnectionStatus('connected')
      setAnnouncement('Connected to game server')
      
      // Join the room
      newSocket.emit('join-room', { 
        roomId, 
        user: {
          id: user.id,
          email: user.email,
          name: user.email.split('@')[0]
        }
      })
    })

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected')
      setAnnouncement('Disconnected from game server')
    })

    newSocket.on('connect_error', () => {
      setConnectionStatus('error')
      setAnnouncement('Connection error. Please refresh the page.')
    })

    // Game event handlers
    newSocket.on('game-state-update', (state) => {
      setGameState(state)
      
      // Screen reader announcements
      if (state.currentCard && state.gameStatus === 'playing') {
        setAnnouncement(`New flashcard: ${state.currentCard.question}`)
      }
      
      if (state.gameStatus === 'finished' && state.winner) {
        const winnerName = state.winner.name || state.winner.email?.split('@')[0] || 'Player'
        setAnnouncement(`Game over! ${winnerName} wins with ${state.scores[state.winner.id]} points!`)
      } else if (state.gameStatus === 'finished' && !state.winner) {
        setAnnouncement('Game over! It\'s a tie!')
      }
    })

    newSocket.on('correct-answer', (data) => {
      const playerName = data.player?.name || data.player?.email?.split('@')[0] || 'Player'
      setAnnouncement(`${playerName} answered correctly! Score: ${data.newScore}`)
    })

    newSocket.on('wrong-answer', (data) => {
      const playerName = data.player?.name || data.player?.email?.split('@')[0] || 'Player'
      setAnnouncement(`Wrong answer from ${playerName}`)
    })

    newSocket.on('player-joined', (data) => {
      const playerName = data.player?.name || data.player?.email?.split('@')[0] || 'Player'
      setAnnouncement(`${playerName} joined the game`)
    })

    newSocket.on('player-left', (data) => {
      const playerName = data.player?.name || data.player?.email?.split('@')[0] || 'Player'
      setAnnouncement(`${playerName} left the game`)
    })

    newSocket.on('game-started', () => {
      setAnnouncement('Game started! Get ready to answer flashcards!')
    })

    return () => {
      newSocket.close()
    }
  }, [roomId, user])

  const submitAnswer = (answer) => {
    if (socket && gameState.gameStatus === 'playing' && gameState.currentCard) {
      socket.emit('submit-answer', {
        roomId,
        answer,
        userId: user.id
      })
    }
  }

  const startGame = () => {
    if (socket && gameState.players.length === 2) {
      socket.emit('start-game', { roomId })
      setAnnouncement('Starting game...')
    }
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId)
      setRoomIdCopied(true)
      setAnnouncement('Room ID copied to clipboard')
      setTimeout(() => setRoomIdCopied(false), 2000)
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = roomId
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setRoomIdCopied(true)
      setAnnouncement('Room ID copied to clipboard')
      setTimeout(() => setRoomIdCopied(false), 2000)
    }
  }

  const leaveGame = () => {
    if (socket) {
      socket.disconnect()
    }
    window.location.href = '/'
  }

  if (connectionStatus === 'connecting') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to game...</p>
        </div>
      </div>
    )
  }

  if (connectionStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-6">
            Unable to connect to the game server. Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 px-4">
      <AccessibilityAnnouncer message={announcement} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Flashcard Frenzy
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Room ID:</span>
              <code className="bg-gray-100 px-3 py-1 rounded font-mono text-sm">
                {roomId}
              </code>
              <button
                onClick={copyRoomId}
                className="btn-secondary text-xs px-2 py-1"
                title="Copy room ID"
              >
                {roomIdCopied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            
            <button
              onClick={leaveGame}
              className="btn-danger text-sm px-3 py-1"
            >
              🚪 Leave Game
            </button>
          </div>
          
          {gameState.gameStatus === 'playing' && (
            <div className="text-sm text-gray-600">
              Question {gameState.currentCardIndex + 1} of {gameState.totalCards}
            </div>
          )}
        </div>

        {/* Player Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
          {gameState.players.map((player, index) => (
            <PlayerScore
              key={player.id}
              player={player}
              score={gameState.scores[player.id] || 0}
              isCurrentUser={player.id === user.id}
              maxScore={5}
              isWinner={gameState.winner?.id === player.id}
              gameStatus={gameState.gameStatus}
            />
          ))}
          
          {/* Empty slot for second player */}
          {gameState.players.length === 1 && (
            <div className="card text-center border-dashed border-2 border-gray-300">
              <div className="py-8">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-gray-600 font-medium">Waiting for opponent...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Share the room ID with a friend!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Game Content */}
        <div className="max-w-4xl mx-auto">
          {gameState.gameStatus === 'waiting' && (
            <div className="card text-center">
              <h2 className="text-2xl font-bold mb-4">
                {gameState.players.length === 1 ? 'Waiting for Players...' : 'Ready to Start!'}
              </h2>
              
              {gameState.players.length === 1 && (
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Share this room ID with a friend to start playing:
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg">
                      {roomId}
                    </code>
                    <button
                      onClick={copyRoomId}
                      className="btn-primary"
                    >
                      {roomIdCopied ? '✓ Copied!' : '📋 Copy ID'}
                    </button>
                  </div>
                </div>
              )}
              
              {gameState.players.length === 2 && (
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Both players are ready! Click start to begin the flashcard race.
                  </p>
                  <button
                    onClick={startGame}
                    className="btn-success text-lg px-8 py-3"
                  >
                    🚀 Start Game
                  </button>
                </div>
              )}
            </div>
          )}

          {gameState.gameStatus === 'playing' && gameState.currentCard && (
            <FlashCard
              card={gameState.currentCard}
              onSubmitAnswer={submitAnswer}
              disabled={false}
            />
          )}

          {gameState.gameStatus === 'finished' && (
            <div className="card text-center">
              <h2 className="text-3xl font-bold mb-6">🎉 Game Over!</h2>
              
              {gameState.winner ? (
                <div className="mb-6">
                  <p className="text-2xl font-semibold text-yellow-600 mb-2">
                    👑 {gameState.winner.name || gameState.winner.email?.split('@')[0]} Wins!
                  </p>
                  <p className="text-gray-600">
                    Final Score: {gameState.scores[gameState.winner.id]} points
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-2xl font-semibold text-gray-600 mb-2">
                    🤝 It's a Tie!
                  </p>
                  <p className="text-gray-600">Great game, both players!</p>
                </div>
              )}
              
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = '/history'}
                  className="btn-primary text-lg px-6 py-3 mr-4"
                >
                  📊 View Game History
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-secondary text-lg px-6 py-3"
                >
                  🏠 Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}