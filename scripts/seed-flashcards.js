const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

const flashcards = [
  {
    question: "What is the capital of France?",
    answer: "Paris",
    hint: "City of Light",
    category: "Geography",
    difficulty: "easy"
  },
  {
    question: "What is 2 + 2?",
    answer: "4",
    hint: "Basic arithmetic",
    category: "Math",
    difficulty: "easy"
  },
  {
    question: "Who painted the Mona Lisa?",
    answer: "Leonardo da Vinci",
    hint: "Renaissance artist and inventor",
    category: "Art",
    difficulty: "medium"
  },
  {
    question: "What is the largest planet in our solar system?",
    answer: "Jupiter",
    hint: "Gas giant with a Great Red Spot",
    category: "Science",
    difficulty: "easy"
  },
  {
    question: "What year did World War II end?",
    answer: "1945",
    hint: "Mid-1940s",
    category: "History",
    difficulty: "medium"
  },
  {
    question: "What is the chemical symbol for gold?",
    answer: "Au",
    hint: "From Latin 'aurum'",
    category: "Science",
    difficulty: "medium"
  },
  {
    question: "Who wrote Romeo and Juliet?",
    answer: "William Shakespeare",
    hint: "English playwright from the 16th century",
    category: "Literature",
    difficulty: "easy"
  },
  {
    question: "What is the speed of light in a vacuum?",
    answer: "299,792,458 m/s",
    hint: "Approximately 300,000 km/s",
    category: "Physics",
    difficulty: "hard"
  },
  {
    question: "What is the smallest country in the world?",
    answer: "Vatican City",
    hint: "Located entirely within Rome",
    category: "Geography",
    difficulty: "medium"
  },
  {
    question: "What is the hardest natural substance on Earth?",
    answer: "Diamond",
    hint: "Used in jewelry and cutting tools",
    category: "Science",
    difficulty: "easy"
  },
  {
    question: "Who developed the theory of relativity?",
    answer: "Albert Einstein",
    hint: "German-born physicist, E=mc²",
    category: "Science",
    difficulty: "easy"
  },
  {
    question: "What is the longest river in the world?",
    answer: "Nile River",
    hint: "Flows through northeastern Africa",
    category: "Geography",
    difficulty: "medium"
  },
  {
    question: "What programming language was created by Guido van Rossum?",
    answer: "Python",
    hint: "Named after a British comedy group",
    category: "Technology",
    difficulty: "medium"
  },
  {
    question: "What is the square root of 144?",
    answer: "12",
    hint: "12 × 12 = 144",
    category: "Math",
    difficulty: "easy"
  },
  {
    question: "Who composed The Four Seasons?",
    answer: "Antonio Vivaldi",
    hint: "Italian Baroque composer",
    category: "Music",
    difficulty: "medium"
  },
  {
    question: "What is the most abundant gas in Earth's atmosphere?",
    answer: "Nitrogen",
    hint: "Makes up about 78% of the atmosphere",
    category: "Science",
    difficulty: "medium"
  },
  {
    question: "In which year did the Berlin Wall fall?",
    answer: "1989",
    hint: "Late 1980s, end of Cold War era",
    category: "History",
    difficulty: "medium"
  },
  {
    question: "What is the currency of Japan?",
    answer: "Yen",
    hint: "Symbol: ¥",
    category: "Geography",
    difficulty: "easy"
  },
  {
    question: "Who wrote '1984'?",
    answer: "George Orwell",
    hint: "British author, also wrote Animal Farm",
    category: "Literature",
    difficulty: "medium"
  },
  {
    question: "What is the boiling point of water at sea level?",
    answer: "100°C",
    hint: "212°F or 373.15 K",
    category: "Science",
    difficulty: "easy"
  },
  {
    question: "Which planet is known as the Red Planet?",
    answer: "Mars",
    hint: "Fourth planet from the Sun",
    category: "Science",
    difficulty: "easy"
  },
  {
    question: "What does HTML stand for?",
    answer: "HyperText Markup Language",
    hint: "The standard markup language for web pages",
    category: "Technology",
    difficulty: "medium"
  },
  {
    question: "Who painted 'The Starry Night'?",
    answer: "Vincent van Gogh",
    hint: "Dutch post-impressionist painter",
    category: "Art",
    difficulty: "medium"
  },
  {
    question: "What is the largest ocean on Earth?",
    answer: "Pacific Ocean",
    hint: "Covers about one-third of Earth's surface",
    category: "Geography",
    difficulty: "easy"
  },
  {
    question: "What is the value of π (pi) to two decimal places?",
    answer: "3.14",
    hint: "Ratio of circumference to diameter",
    category: "Math",
    difficulty: "easy"
  }
]

async function seedFlashcards() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('flashcard_frenzy')
    const collection = db.collection('flashcards')
    
    // Clear existing flashcards
    await collection.deleteMany({})
    console.log('Cleared existing flashcards')
    
    // Insert new flashcards
    const result = await collection.insertMany(flashcards)
    console.log(`Inserted ${result.insertedCount} flashcards`)
    
    // Create indexes for better performance
    await collection.createIndex({ category: 1 })
    await collection.createIndex({ difficulty: 1 })
    console.log('Created indexes')
    
  } catch (error) {
    console.error('Error seeding flashcards:', error)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

if (require.main === module) {
  seedFlashcards()
}

module.exports = { seedFlashcards, flashcards }