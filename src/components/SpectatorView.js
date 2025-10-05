'use client'

import { useState, useEffect, useRef } from 'react'
import { useSocket } from '@/lib/socket'
import { PlayerScore } from './PlayerScore'

export function SpectatorView({ roomId, user }) {
  const socket = useSocket()
  const [gameState, setGameState] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (!socket || !roomId || !user) return

    // Join as spectator
    socket.emit('join-as-spectator', { roomId, user })
    setIsConnected(true)

    // Listen for spectator state updates
    socket.on('spectator-state-update', (state) => {
      setGameState(state)
      setChatMessages(state.spectatorChat || [])
    })

    // Listen for chat messages
    socket.on('spectator-chat-message', (message) => {
      setChatMessages(prev => [...prev, message])
    })

    // Listen for game events
    socket.on('game-started', () => {
      console.log('Game started - spectator view')
    })

    socket.on('correct-answer', (data) => {
      console.log('Correct answer by:', data.playerName)
    })

    socket.on('wrong-answer', (data) => {
      console.log('Wrong answer by:', data.playerName)
    })

    return () => {
      socket.off('spectator-state-update')
      socket.off('spectator-chat-message')
      socket.off('game-started')
      socket.off('correct-answer')
      socket.off('wrong-answer')
    }
  }, [socket, roomId, user])

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const sendChatMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    socket.emit('spectator-chat', {
      roomId,
      user,
      message: newMessage.trim()
    })

    setNewMessage('')
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!isConnected || !gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                🎮 Spectating Room: {roomId}
              </h1>
              <p className="text-gray-600 mt-1">
                Watching as {user.name || user.email?.split('@')[0]}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {gameState.spectators?.length || 0} spectator(s)
              </div>
              <div className="text-lg font-semibold text-blue-600">
                {gameState.gameStatus === 'waiting' && 'Waiting for players'}
                {gameState.gameStatus === 'playing' && 'Game in progress'}
                {gameState.gameStatus === 'finished' && 'Game finished'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game View */}
          <div className="lg:col-span-2 space-y-6">
            {/* Players */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Players</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameState.players?.map((player, index) => (
                  <PlayerScore
                    key={player.id}
                    player={player}
                    score={gameState.scores?.[player.id] || 0}
                    isWinner={gameState.winner?.id === player.id}
                    position={index + 1}
                  />
                ))}
                {gameState.players?.length < 2 && (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-500">Waiting for player...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Card */}
            {gameState.gameStatus === 'playing' && gameState.currentCard && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Current Question</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-lg text-gray-800 mb-4">
                    {gameState.currentCard.question}
                  </p>
                  <div className="text-sm text-gray-600">
                    Question {gameState.currentCardIndex + 1} of {gameState.totalCards}
                  </div>
                </div>
              </div>
            )}

            {/* Game Status */}
            {gameState.gameStatus === 'finished' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Game Results</h2>
                {gameState.winner ? (
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <p className="text-xl font-semibold text-green-600">
                      {gameState.winner.name || gameState.winner.email?.split('@')[0]} wins!
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-3xl mb-2">🤝</div>
                    <p className="text-xl font-semibold text-blue-600">
                      It's a tie!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Spectator Chat */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Spectator Chat</h2>
            
            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50">
              {chatMessages.length === 0 ? (
                <p className="text-gray-500 text-center">No messages yet...</p>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="mb-2">
                    <div className="text-xs text-gray-500">
                      {formatTime(msg.timestamp)} - {msg.spectator.name || msg.spectator.email?.split('@')[0]}
                    </div>
                    <div className="text-sm text-gray-800">{msg.message}</div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={sendChatMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
            
            <div className="text-xs text-gray-500 mt-2">
              {gameState.spectators?.length || 0} spectator(s) online
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}