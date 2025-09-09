# Flashcard Frenzy Multiplayer

A real-time multiplayer flashcard game where two players race to answer questions correctly. Built with Next.js, Supabase for authentication, and MongoDB for data persistence.

## Features

- **Real-time Multiplayer**: Two players compete in real-time using Socket.IO
- **Authentication**: Secure login with Supabase Auth
- **Match History**: Persistent game history stored in MongoDB
- **Accessibility**: Screen reader announcements and ARIA labels
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: MongoDB for game history and flashcards
- **Real-time**: Socket.IO for multiplayer functionality

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/1234-ad/flashcard-frenzy-multiplayer.git
   cd flashcard-frenzy-multiplayer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase and MongoDB credentials

4. **Database Setup**
   - Create a Supabase project at https://supabase.com
   - Set up MongoDB database (Atlas recommended)
   - Import sample flashcards using the provided script

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000** in your browser

## Game Rules

- Two players join a room using a room ID
- Players race to answer flashcards correctly
- First correct answer scores a point
- Game continues for 10 questions
- Match history is saved for both players

## Accessibility Features

- Screen reader announcements for all game events
- Proper ARIA labels and semantic HTML
- Keyboard navigation support
- High contrast design elements
- Focus management for better UX

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── lib/                # Utility libraries
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning and development!