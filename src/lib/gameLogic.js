export class GameRoom {
  constructor(roomId) {
    this.roomId = roomId
    this.players = []
    this.currentCardIndex = 0
    this.flashcards = []
    this.scores = {}
    this.gameStatus = 'waiting' // waiting, playing, finished
    this.winner = null
    this.maxScore = 5
    this.startTime = null
  }

  addPlayer(player) {
    if (this.players.length < 2 && !this.players.find(p => p.id === player.id)) {
      this.players.push(player)
      this.scores[player.id] = 0
      return true
    }
    return false
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId)
    delete this.scores[playerId]
    
    if (this.players.length === 0) {
      this.gameStatus = 'finished'
    }
  }

  startGame(flashcards) {
    if (this.players.length === 2 && this.gameStatus === 'waiting') {
      this.flashcards = flashcards
      this.gameStatus = 'playing'
      this.startTime = new Date()
      this.currentCardIndex = 0
      return true
    }
    return false
  }

  getCurrentCard() {
    if (this.currentCardIndex < this.flashcards.length) {
      return this.flashcards[this.currentCardIndex]
    }
    return null
  }

  submitAnswer(playerId, answer) {
    if (this.gameStatus !== 'playing') {
      return { success: false, reason: 'Game not in progress' }
    }

    const currentCard = this.getCurrentCard()
    if (!currentCard) {
      return { success: false, reason: 'No current card' }
    }

    const isCorrect = this.checkAnswer(answer, currentCard.answer)
    
    if (isCorrect) {
      this.scores[playerId]++
      this.currentCardIndex++
      
      const player = this.players.find(p => p.id === playerId)
      
      // Check for winner
      if (this.scores[playerId] >= this.maxScore) {
        this.gameStatus = 'finished'
        this.winner = player
      }
      
      // Check if all cards are used
      if (this.currentCardIndex >= this.flashcards.length) {
        this.gameStatus = 'finished'
        this.determineWinner()
      }
      
      return {
        success: true,
        correct: true,
        player,
        newScore: this.scores[playerId],
        gameFinished: this.gameStatus === 'finished'
      }
    }
    
    return {
      success: true,
      correct: false,
      player: this.players.find(p => p.id === playerId)
    }
  }

  checkAnswer(userAnswer, correctAnswer) {
    const normalize = (str) => str.toLowerCase().trim().replace(/[^\w\s]/g, '')
    return normalize(userAnswer) === normalize(correctAnswer)
  }

  determineWinner() {
    const maxScore = Math.max(...Object.values(this.scores))
    const winners = this.players.filter(p => this.scores[p.id] === maxScore)
    
    if (winners.length === 1) {
      this.winner = winners[0]
    } else {
      this.winner = null // Tie
    }
  }

  getGameState() {
    return {
      roomId: this.roomId,
      players: this.players,
      currentCard: this.getCurrentCard(),
      scores: this.scores,
      gameStatus: this.gameStatus,
      winner: this.winner,
      currentCardIndex: this.currentCardIndex,
      totalCards: this.flashcards.length
    }
  }

  getGameResult() {
    return {
      roomId: this.roomId,
      player1: this.players[0],
      player2: this.players[1] || null,
      scores: this.scores,
      winner: this.winner,
      duration: this.startTime ? new Date() - this.startTime : 0,
      totalCards: this.flashcards.length,
      completedAt: new Date()
    }
  }
}

export const gameRooms = new Map()

export const getOrCreateRoom = (roomId) => {
  if (!gameRooms.has(roomId)) {
    gameRooms.set(roomId, new GameRoom(roomId))
  }
  return gameRooms.get(roomId)
}

export const removeRoom = (roomId) => {
  gameRooms.delete(roomId)
}