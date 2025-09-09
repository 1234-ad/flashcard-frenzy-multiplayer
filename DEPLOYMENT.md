# Deployment Guide - Flashcard Frenzy Multiplayer

This guide covers how to deploy your Flashcard Frenzy Multiplayer game to various platforms.

## Prerequisites

Before deploying, ensure you have:
- A Supabase project set up
- A MongoDB database (MongoDB Atlas recommended)
- Environment variables configured

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flashcard_frenzy?retryWrites=true&w=majority

# Production URL (for CORS)
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

## Local Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/1234-ad/flashcard-frenzy-multiplayer.git
   cd flashcard-frenzy-multiplayer
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Seed the Database**
   ```bash
   npm run seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key from Settings > API

2. **Configure Authentication**
   - Go to Authentication > Settings
   - Enable email authentication
   - Configure email templates if needed
   - Set up redirect URLs for your domain

## MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free cluster

2. **Configure Database Access**
   - Create a database user
   - Whitelist your IP addresses (or use 0.0.0.0/0 for development)

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and update your `.env.local`

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Add all environment variables from `.env.local`

4. **Custom Server Note**
   - Vercel doesn't support custom servers in production
   - You'll need to modify the Socket.IO implementation for Vercel
   - Consider using Vercel's serverless functions with a separate Socket.IO server

### Option 2: Railway

1. **Connect GitHub Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure Environment Variables**
   - Add all variables from `.env.local` in Railway dashboard

3. **Deploy**
   - Railway will automatically deploy from your main branch

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI from heroku.com/cli
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Configure Environment Variables**
   ```bash
   heroku config:set NEXT_PUBLIC_SUPABASE_URL=your_url
   heroku config:set NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   heroku config:set MONGODB_URI=your_mongodb_uri
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Set Environment Variables**
   - Add all variables in the app settings

## Socket.IO Deployment Considerations

### For Vercel
Since Vercel doesn't support custom servers, you have two options:

1. **Separate Socket.IO Server**
   - Deploy Socket.IO server separately (Railway, Heroku, etc.)
   - Update client to connect to external Socket.IO server

2. **Use Vercel-Compatible Real-time Solution**
   - Consider using Pusher, Ably, or similar services
   - Modify the real-time logic to use these services

### For Other Platforms
The custom server setup should work out of the box on platforms that support Node.js servers.

## Post-Deployment Steps

1. **Seed Production Database**
   ```bash
   # If using Heroku
   heroku run npm run seed
   
   # If using Railway/other platforms
   # Run the seed script through their CLI or dashboard
   ```

2. **Test Functionality**
   - Create user accounts
   - Test game creation and joining
   - Verify real-time multiplayer works
   - Check game history persistence

3. **Configure Domain (Optional)**
   - Set up custom domain
   - Update CORS settings
   - Update Supabase redirect URLs

## Monitoring and Maintenance

1. **Database Monitoring**
   - Monitor MongoDB Atlas metrics
   - Set up alerts for connection issues

2. **Application Monitoring**
   - Use platform-specific monitoring tools
   - Monitor Socket.IO connections
   - Track user engagement

3. **Regular Updates**
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Backup database regularly

## Troubleshooting

### Common Issues

1. **Socket.IO Connection Issues**
   - Check CORS configuration
   - Verify WebSocket support on hosting platform
   - Test with polling fallback

2. **Database Connection Errors**
   - Verify MongoDB URI format
   - Check IP whitelist settings
   - Ensure database user has correct permissions

3. **Authentication Issues**
   - Verify Supabase configuration
   - Check redirect URLs
   - Ensure environment variables are set correctly

### Performance Optimization

1. **Database Optimization**
   - Add indexes for frequently queried fields
   - Implement connection pooling
   - Consider caching for flashcards

2. **Frontend Optimization**
   - Enable Next.js image optimization
   - Implement code splitting
   - Use CDN for static assets

3. **Real-time Optimization**
   - Implement room cleanup
   - Add connection limits
   - Monitor memory usage

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use platform-specific secret management

2. **Database Security**
   - Use strong passwords
   - Limit database user permissions
   - Enable MongoDB Atlas security features

3. **Application Security**
   - Implement rate limiting
   - Validate all user inputs
   - Use HTTPS in production

## Support

If you encounter issues during deployment:
1. Check the platform-specific documentation
2. Review the application logs
3. Test locally first to isolate issues
4. Consider the troubleshooting section above

Happy deploying! 🚀