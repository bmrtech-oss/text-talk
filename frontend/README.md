# Text Talk Frontend

A React-based frontend for a Twitter-like social media platform with content moderation features.

## Features

- Modern React with hooks
- Responsive design
- Theme support (light/dark)
- Real-time content moderation feedback
- JWT authentication
- Tweet management
- User profiles

## Components

### Pages
- Login - User authentication
- Register - User registration
- Dashboard - Main feed with tweets
- Profile - User profile management

### Common Components
- Navbar - Navigation header
- Sidebar - Side navigation
- TweetBox - Create new tweets
- Feed - Display tweets
- ModerationAlert - Content moderation warnings

### Hooks
- useAuth - Authentication management
- useModeration - Content moderation checks
- useApi - API communication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:
```bash
npm start
```

## Environment Variables

- REACT_APP_API_URL - Backend API URL (default: http://localhost:5000)
- REACT_APP_MODERATION_API_KEY - API key for content moderation service
- REACT_APP_GOOGLE_ANALYTICS_ID - Google Analytics tracking ID

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint
- `npm run type-check` - Runs TypeScript type checking (if using TypeScript)

## Deployment

### Using Docker
```bash
docker build -t twitter-clone-frontend .
docker run -p 3000:80 --env-file .env twitter-clone-frontend
```

### Using Nginx
```bash
npm run build
# Serve the build folder using Nginx
```

### Using Netlify/Vercel
Connect your repository to Netlify or Vercel for automatic deployments.
