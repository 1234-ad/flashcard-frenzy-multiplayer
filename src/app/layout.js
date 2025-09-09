import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Flashcard Frenzy Multiplayer',
  description: 'A real-time multiplayer flashcard game where two players race to answer questions correctly.',
  keywords: 'flashcards, multiplayer, game, quiz, education, real-time',
  authors: [{ name: 'Flashcard Frenzy Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">
                    <a href="/" className="hover:text-primary-600 transition-colors">
                      🎯 Flashcard Frenzy
                    </a>
                  </h1>
                </div>
                <nav className="flex space-x-4">
                  <a
                    href="/"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href="/history"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    History
                  </a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600">
                <p>&copy; 2024 Flashcard Frenzy. Built with Next.js, Supabase, and MongoDB.</p>
                <p className="mt-2 text-sm">
                  Race against friends to answer flashcards correctly! 🚀
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}