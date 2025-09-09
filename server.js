const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const { getOrCreateRoom, removeRoom } = require('./src/lib/gameLogic')
const { saveGameResult, getFlashcards, initializeFlashcards } = require('./src/lib/mongodb')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_URL 
        : "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  // Initialize flashcards on server start
  initializeFlashcards().catch(console.error)

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join-room', async ({ roomId, user }) => {
      try {
        socket.join(roomId)
        
        const room = getOrCreateRoom(roomId)
        const playerAdded = room.addPlayer(user)
        
        if (playerAdded) {
          socket.emit('player-joined', { player: user })
          socket.to(roomId).emit('player-joined', { player: user })
          
          // Send updated game state to all players in room
          io.to(roomId).emit('game-state-update', room.getGameState())
        }
        
        console.log(`User ${user.email} joined room ${roomId}`)
      } catch (error) {
        console.error('Error joining room:', error)
        socket.emit('error', { message: 'Failed to join room' })
      }
    })

    socket.on('start-game', async ({ roomId }) => {
      try {
        const room = getOrCreateRoom(roomId)
        
        if (room.players.length === 2) {
          // Fetch flashcards from database
          const flashcards = await getFlashcards(10)
          
          if (room.startGame(flashcards)) {
            io.to(roomId).emit('game-started')
            io.to(roomId).emit('game-state-update', room.getGameState())
            console.log(`Game started in room ${roomId}`)
          }
        }
      } catch (error) {
        console.error('Error starting game:', error)
        socket.emit('error', { message: 'Failed to start game' })
      }
    })

    socket.on('submit-answer', async ({ roomId, answer, userId }) => {
      try {
        const room = getOrCreateRoom(roomId)
        const result = room.submitAnswer(userId, answer)
        
        if (result.success) {
          if (result.correct) {
            // Correct answer
            io.to(roomId).emit('correct-answer', {
              player: result.player,
              playerName: result.player.name || result.player.email?.split('@')[0],
              newScore: result.newScore
            })
            
            // Check if game is finished
            if (result.gameFinished) {
              const gameResult = room.getGameResult()
              
              // Save game result to database
              try {
                await saveGameResult(gameResult)
                console.log(`Game finished in room ${roomId}, result saved`)
              } catch (dbError) {
                console.error('Error saving game result:', dbError)
              }
              
              // Clean up room after a delay
              setTimeout(() => {
                removeRoom(roomId)
                console.log(`Room ${roomId} cleaned up`)
              }, 30000) // 30 seconds delay
            }
          } else {
            // Wrong answer
            io.to(roomId).emit('wrong-answer', {
              player: result.player,
              playerName: result.player.name || result.player.email?.split('@')[0]
            })
          }
          
          // Send updated game state
          io.to(roomId).emit('game-state-update', room.getGameState())
        }
      } catch (error) {
        console.error('Error submitting answer:', error)
        socket.emit('error', { message: 'Failed to submit answer' })
      }
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
      
      // Handle player leaving rooms
      // Note: In a production app, you'd want to track which rooms each socket is in
      // and remove the player from those rooms
    })
  })

  server
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log('> Socket.IO server is running')
    })
})