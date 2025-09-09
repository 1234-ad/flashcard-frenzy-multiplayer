# 🎯 Flashcard Frenzy Multiplayer

A real-time multiplayer flashcard game where two players race to answer questions correctly. Built with Next.js, Supabase for authentication, and MongoDB for data persistence.

## ✨ Features

- **🚀 Real-time Multiplayer**: Two players compete in real-time using Socket.IO
- **🔐 Authentication**: Secure login with Supabase Auth
- **📊 Match History**: Persistent game history stored in MongoDB
- **♿ Accessibility**: Screen reader announcements and ARIA labels
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **🎮 Instant Feedback**: Real-time scoring and game state updates
- **🏆 Winner Detection**: Automatic game completion and winner announcement
- **📋 Room System**: Easy game creation and joining with room IDs

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: MongoDB for game history and flashcards
- **Real-time**: Socket.IO for multiplayer functionality
- **Styling**: Tailwind CSS with custom components
- **Deployment**: Vercel, Railway, Heroku compatible

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB database (Atlas recommended)
- Supabase project

### Installation

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
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000** in your browser

## 🎮 How to Play

1. **Sign Up/Login**: Create an account or sign in
2. **Create Game**: Click "Create New Game" to start a room
3. **Share Room ID**: Give the room ID to a friend
4. **Join Game**: Your friend enters the room ID to join
5. **Start Racing**: Answer flashcards as fast as possible
6. **Win**: First to 5 correct answers wins!

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── layout.js          # Root layout
│   ├── page.js            # Homepage
│   ├── login/             # Authentication pages
│   ├── game/[roomId]/     # Dynamic game pages
│   ├── history/           # Game history page
│   └── api/               # API routes
├── components/            # React components
│   ├── GameBoard.js       # Main game interface
│   ├── FlashCard.js       # Flashcard component
│   ├── PlayerScore.js     # Score display
│   ├── GameHistory.js     # History component
│   └── AccessibilityAnnouncer.js
├── lib/                   # Utility libraries
│   ├── supabase.js        # Supabase client
│   ├── mongodb.js         # MongoDB utilities
│   └── gameLogic.js       # Game state management
└── styles/
    └── globals.css        # Global styles
```

## 🎯 Game Rules

- **Players**: Exactly 2 players per game
- **Objective**: First to answer 5 questions correctly wins
- **Speed Matters**: Fastest correct answer gets the point
- **Questions**: Random selection from 25+ flashcards
- **Categories**: Geography, Science, History, Math, Literature, and more

## ♿ Accessibility Features

- **Screen Reader Support**: Comprehensive ARIA labels and live regions
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Clear visual design with good color contrast
- **Focus Management**: Proper focus handling throughout the game
- **Announcements**: Real-time game state announcements for screen readers

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for various platforms:

- **Vercel** (recommended for Next.js)
- **Railway** (supports custom servers)
- **Heroku** (classic deployment)
- **DigitalOcean App Platform**

### Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/your-template-id)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with Socket.IO
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with flashcards
- `npm run lint` - Run ESLint

### Adding New Flashcards

Edit `scripts/seed-flashcards.js` and run:
```bash
npm run seed
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXT_PUBLIC_APP_URL` | Production app URL (for CORS) | Production only |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add proper TypeScript types where applicable
- Include accessibility features in new components
- Test multiplayer functionality thoroughly
- Update documentation for new features

## 📝 API Documentation

### Game History API
```
GET /api/game-history?userId={userId}
```

### Flashcards API
```
GET /api/flashcards?limit={number}
```

### Socket.IO Events

**Client to Server:**
- `join-room` - Join a game room
- `start-game` - Start the game
- `submit-answer` - Submit an answer

**Server to Client:**
- `game-state-update` - Game state changes
- `correct-answer` - Correct answer submitted
- `wrong-answer` - Wrong answer submitted
- `player-joined` - Player joined room
- `game-started` - Game has started

## 🐛 Troubleshooting

### Common Issues

1. **Socket.IO Connection Failed**
   - Check if port 3000 is available
   - Verify CORS settings
   - Try refreshing the page

2. **Database Connection Error**
   - Verify MongoDB URI format
   - Check network connectivity
   - Ensure database user has proper permissions

3. **Authentication Issues**
   - Verify Supabase configuration
   - Check environment variables
   - Clear browser cache

## 📊 Performance

- **Real-time Latency**: < 100ms for answer submissions
- **Database Queries**: Optimized with proper indexing
- **Bundle Size**: Optimized with Next.js automatic code splitting
- **Accessibility**: 100% keyboard navigable

## 🔒 Security

- **Authentication**: Secure JWT tokens via Supabase
- **Data Validation**: Server-side input validation
- **Rate Limiting**: Built-in protection against spam
- **Environment Variables**: Secure credential management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Supabase** for seamless authentication
- **MongoDB** for reliable data persistence
- **Socket.IO** for real-time multiplayer functionality
- **Tailwind CSS** for beautiful, responsive design

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Deployment Guide](DEPLOYMENT.md)
3. Open an issue on GitHub
4. Check existing issues for solutions

---

**Built with ❤️ for educational gaming and real-time multiplayer experiences!**

🎯 **Ready to test your knowledge? Start playing Flashcard Frenzy now!** 🚀