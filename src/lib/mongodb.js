import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

export const getDatabase = async () => {
  const client = await clientPromise
  return client.db('flashcard_frenzy')
}

export const saveGameResult = async (gameData) => {
  const db = await getDatabase()
  const collection = db.collection('game_history')
  return await collection.insertOne({
    ...gameData,
    createdAt: new Date()
  })
}

export const getGameHistory = async (userId) => {
  const db = await getDatabase()
  const collection = db.collection('game_history')
  return await collection.find({
    $or: [
      { 'player1.id': userId },
      { 'player2.id': userId }
    ]
  }).sort({ createdAt: -1 }).limit(20).toArray()
}

export const getFlashcards = async (limit = 10) => {
  const db = await getDatabase()
  const collection = db.collection('flashcards')
  const cards = await collection.aggregate([
    { $sample: { size: limit } }
  ]).toArray()
  
  return cards.length > 0 ? cards : await getDefaultFlashcards()
}

export const getDefaultFlashcards = async () => {
  return [
    {
      question: "What is the capital of France?",
      answer: "Paris",
      hint: "City of Light"
    },
    {
      question: "What is 2 + 2?",
      answer: "4",
      hint: "Basic arithmetic"
    },
    {
      question: "Who painted the Mona Lisa?",
      answer: "Leonardo da Vinci",
      hint: "Renaissance artist"
    },
    {
      question: "What is the largest planet in our solar system?",
      answer: "Jupiter",
      hint: "Gas giant"
    },
    {
      question: "What year did World War II end?",
      answer: "1945",
      hint: "Mid-1940s"
    },
    {
      question: "What is the chemical symbol for gold?",
      answer: "Au",
      hint: "From Latin 'aurum'"
    },
    {
      question: "Who wrote Romeo and Juliet?",
      answer: "William Shakespeare",
      hint: "English playwright"
    },
    {
      question: "What is the speed of light?",
      answer: "299,792,458 m/s",
      hint: "Approximately 300,000 km/s"
    },
    {
      question: "What is the smallest country in the world?",
      answer: "Vatican City",
      hint: "Located in Rome"
    },
    {
      question: "What is the hardest natural substance?",
      answer: "Diamond",
      hint: "Used in jewelry"
    }
  ]
}

export const initializeFlashcards = async () => {
  const db = await getDatabase()
  const collection = db.collection('flashcards')
  const count = await collection.countDocuments()
  
  if (count === 0) {
    const defaultCards = await getDefaultFlashcards()
    await collection.insertMany(defaultCards)
    console.log('Initialized flashcards collection with default data')
  }
}