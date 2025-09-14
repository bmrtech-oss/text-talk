#!/bin/bash

# Twitter Clone Project Structure Creator
# This script creates separate frontend and backend projects

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${GREEN}[+]${NC} $1"
}

# Function to print info messages
print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

# Function to print error messages
print_error() {
    echo -e "${RED}[!]${NC} $1"
}

# Function to create directory if it doesn't exist
create_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        print_status "Created directory: $1"
    else
        print_error "Directory already exists: $1"
    fi
}

# Function to create file if it doesn't exist
create_file() {
    if [ ! -f "$1" ]; then
        touch "$1"
        print_status "Created file: $1"
    else
        print_error "File already exists: $1"
    fi
}

# Function to create backend project
create_backend() {
    print_info "Creating Backend Project..."
    
    # Create backend directory structure
    create_dir "backend/src/controllers"
    create_dir "backend/src/models"
    create_dir "backend/src/routes"
    create_dir "backend/src/middleware"
    create_dir "backend/src/config"
    create_dir "backend/src/utils"
    create_dir "backend/tests"
    create_dir "backend/scripts"

    # Create backend files
    create_file "backend/package.json"
    create_file "backend/package-lock.json"
    create_file "backend/Dockerfile"
    create_file "backend/.dockerignore"
    create_file "backend/.env"
    create_file "backend/.env.example"
    create_file "backend/.gitignore"
    create_file "backend/README.md"
    create_file "backend/server.js"
    create_file "backend/src/config/database.js"
    create_file "backend/src/config/redis.js"
    create_file "backend/src/middleware/auth.js"
    create_file "backend/src/middleware/validation.js"
    create_file "backend/src/middleware/moderation.js"
    create_file "backend/src/middleware/rateLimit.js"
    create_file "backend/src/models/User.js"
    create_file "backend/src/models/Tweet.js"
    create_file "backend/src/models/ModerationLog.js"
    create_file "backend/src/controllers/authController.js"
    create_file "backend/src/controllers/tweetController.js"
    create_file "backend/src/controllers/moderationController.js"
    create_file "backend/src/controllers/userController.js"
    create_file "backend/src/routes/auth.js"
    create_file "backend/src/routes/tweets.js"
    create_file "backend/src/routes/moderation.js"
    create_file "backend/src/routes/users.js"
    create_file "backend/src/utils/moderationAPI.js"
    create_file "backend/src/utils/logger.js"
    create_file "backend/src/utils/helpers.js"
    create_file "backend/tests/auth.test.js"
    create_file "backend/tests/tweets.test.js"
    create_file "backend/tests/moderation.test.js"
    create_file "backend/scripts/migrate.js"
    create_file "backend/scripts/seed.js"

    # Add content to backend package.json
    cat > backend/package.json << EOF
{
  "name": "twitter-clone-backend",
  "version": "1.0.0",
  "description": "Backend API for Twitter clone with content moderation",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "migrate": "node scripts/migrate.js",
    "seed": "node scripts/seed.js"
  },
  "keywords": ["twitter", "clone", "api", "moderation", "social"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.4.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^6.1.5",
    "dotenv": "^16.1.4",
    "redis": "^4.6.4",
    "axios": "^1.4.0",
    "express-rate-limit": "^6.7.0",
    "joi": "^17.9.2",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0",
    "supertest": "^6.3.3",
    "eslint": "^8.43.0",
    "eslint-plugin-jest": "^27.2.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
EOF

    # Add content to backend README.md
    cat > backend/README.md << EOF
# Twitter Clone Backend API

A Node.js/Express backend API for a Twitter-like social media platform with content moderation features.

## Features

- User authentication (JWT)
- Tweet management
- AI-powered content moderation
- Rate limiting
- Redis caching
- MongoDB database

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user profile
- POST /api/auth/logout - Logout user

### Tweets
- GET /api/tweets - Get all tweets (with pagination)
- POST /api/tweets - Create a new tweet (with moderation)
- GET /api/tweets/:id - Get a specific tweet
- PUT /api/tweets/:id - Update a tweet
- DELETE /api/tweets/:id - Delete a tweet
- POST /api/tweets/:id/like - Like a tweet
- POST /api/tweets/:id/retweet - Retweet a tweet

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get a specific user
- GET /api/users/:id/tweets - Get tweets by a user
- PUT /api/users/:id - Update user profile

### Moderation
- GET /api/moderation/logs - Get moderation logs (admin only)
- POST /api/moderation/check - Check text for moderation

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Environment Variables

- PORT - Server port (default: 5000)
- MONGODB_URI - MongoDB connection string
- REDIS_URL - Redis connection URL
- JWT_SECRET - JWT secret key
- MODERATION_API_KEY - API key for content moderation service
- NODE_ENV - Environment (development/production)

## Deployment

### Using Docker
\`\`\`bash
docker build -t twitter-clone-backend .
docker run -p 5000:5000 --env-file .env twitter-clone-backend
\`\`\`

### Using PM2
\`\`\`bash
npm install -g pm2
pm2 start server.js --name twitter-backend
\`\`\`
EOF

    # Add content to backend Dockerfile
    cat > backend/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S twitter -u 1001

# Change ownership of the app directory
RUN chown -R twitter:nodejs /app

# Switch to non-root user
USER twitter

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js

# Start the application
CMD ["node", "server.js"]
EOF

    print_info "Backend project created successfully!"
}

# Function to create frontend project
create_frontend() {
    print_info "Creating Frontend Project..."
    
    # Create frontend directory structure
    create_dir "frontend/public"
    create_dir "frontend/src/components"
    create_dir "frontend/src/pages"
    create_dir "frontend/src/hooks"
    create_dir "frontend/src/utils"
    create_dir "frontend/src/contexts"
    create_dir "frontend/src/services"
    create_dir "frontend/src/styles"
    create_dir "frontend/src/assets"
    create_dir "frontend/build"
    create_dir "frontend/docs"

    # Create frontend files
    create_file "frontend/package.json"
    create_file "frontend/package-lock.json"
    create_file "frontend/Dockerfile"
    create_file "frontend/.dockerignore"
    create_file "frontend/.env"
    create_file "frontend/.env.example"
    create_file "frontend/.gitignore"
    create_file "frontend/README.md"
    create_file "frontend/public/index.html"
    create_file "frontend/public/manifest.json"
    create_file "frontend/public/robots.txt"
    create_file "frontend/src/App.js"
    create_file "frontend/src/App.css"
    create_file "frontend/src/index.js"
    create_file "frontend/src/index.css"
    create_file "frontend/src/components/TweetBox.js"
    create_file "frontend/src/components/TweetBox.css"
    create_file "frontend/src/components/Feed.js"
    create_file "frontend/src/components/Feed.css"
    create_file "frontend/src/components/Sidebar.js"
    create_file "frontend/src/components/Sidebar.css"
    create_file "frontend/src/components/ModerationAlert.js"
    create_file "frontend/src/components/ModerationAlert.css"
    create_file "frontend/src/components/Navbar.js"
    create_file "frontend/src/components/Navbar.css"
    create_file "frontend/src/pages/Login.js"
    create_file "frontend/src/pages/Login.css"
    create_file "frontend/src/pages/Register.js"
    create_file "frontend/src/pages/Register.css"
    create_file "frontend/src/pages/Dashboard.js"
    create_file "frontend/src/pages/Dashboard.css"
    create_file "frontend/src/pages/Profile.js"
    create_file "frontend/src/pages/Profile.css"
    create_file "frontend/src/hooks/useModeration.js"
    create_file "frontend/src/hooks/useAuth.js"
    create_file "frontend/src/hooks/useApi.js"
    create_file "frontend/src/utils/api.js"
    create_file "frontend/src/utils/helpers.js"
    create_file "frontend/src/contexts/AuthContext.js"
    create_file "frontend/src/contexts/ThemeContext.js"
    create_file "frontend/src/services/authService.js"
    create_file "frontend/src/services/tweetService.js"
    create_file "frontend/src/services/moderationService.js"
    create_file "frontend/src/styles/globals.css"
    create_file "frontend/src/styles/themes.css"
    create_file "frontend/src/styles/variables.css"

    # Add content to frontend package.json
    cat > frontend/package.json << EOF
{
  "name": "twitter-clone-frontend",
  "version": "1.0.0",
  "description": "Frontend for Twitter clone with content moderation",
  "main": "src/index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "type-check": "tsc --noEmit"
  },
  "keywords": ["twitter", "clone", "react", "frontend", "moderation", "social"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "react-router-dom": "^6.11.2",
    "axios": "^1.4.0",
    "react-query": "^3.39.3",
    "styled-components": "^6.0.0",
    "react-hot-toast": "^2.4.1",
    "react-hook-form": "^7.45.4",
    "framer-motion": "^10.12.16",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "eslint": "^8.43.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^2.8.8"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:5000"
}
EOF

    # Add content to frontend README.md
    cat > frontend/README.md << EOF
# Twitter Clone Frontend

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
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

## Environment Variables

- REACT_APP_API_URL - Backend API URL (default: http://localhost:5000)
- REACT_APP_MODERATION_API_KEY - API key for content moderation service
- REACT_APP_GOOGLE_ANALYTICS_ID - Google Analytics tracking ID

## Available Scripts

- \`npm start\` - Runs the app in development mode
- \`npm test\` - Launches the test runner
- \`npm run build\` - Builds the app for production
- \`npm run lint\` - Runs ESLint
- \`npm run type-check\` - Runs TypeScript type checking (if using TypeScript)

## Deployment

### Using Docker
\`\`\`bash
docker build -t twitter-clone-frontend .
docker run -p 3000:80 --env-file .env twitter-clone-frontend
\`\`\`

### Using Nginx
\`\`\`bash
npm run build
# Serve the build folder using Nginx
\`\`\`

### Using Netlify/Vercel
Connect your repository to Netlify or Vercel for automatic deployments.
EOF

    # Add content to frontend Dockerfile
    cat > frontend/Dockerfile << EOF
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF

    print_info "Frontend project created successfully!"
}

# Function to create shared resources
create_shared() {
    print_info "Creating Shared Resources..."
    
    # Create shared directory structure
    create_dir "shared"
    create_dir "shared/schemas"
    create_dir "shared/types"
    create_dir "shared/constants"
    create_dir "shared/utils"
    create_dir "docs"
    create_dir "deployment"
    create_dir "scripts"

    # Create shared files
    create_file "shared/schemas/user.js"
    create_file "shared/schemas/tweet.js"
    create_file "shared/types/index.js"
    create_file "shared/constants/api.js"
    create_file "shared/constants/errors.js"
    create_file "shared/utils/validation.js"
    create_file "shared/utils/helpers.js"
    create_file "docs/API.md"
    create_file "docs/ARCHITECTURE.md"
    create_file "docs/DEPLOYMENT.md"
    create_file "deployment/docker-compose.yml"
    create_file "deployment/podman-compose.yml"
    create_file "deployment/kubernetes.yaml"
    create_file "scripts/setup.sh"
    create_file "scripts/deploy.sh"
    create_file "README.md"

    # Add content to main README.md
    cat > README.md << EOF
# Twitter Clone with Content Moderation

A full-stack Twitter-like social media platform with AI-powered content moderation to ensure compliance with country-specific laws and regulations.

## Project Structure

\`\`\`
.
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Utility functions
│   ├── tests/               # Test files
│   ├── Dockerfile           # Docker configuration
│   └── package.json         # Backend dependencies
├── frontend/                # React frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Frontend utilities
│   │   └── styles/          # CSS styles
│   ├── build/               # Build output
│   ├── Dockerfile           # Docker configuration
│   └── package.json         # Frontend dependencies
├── shared/                  # Shared resources
│   ├── schemas/             # Data schemas
│   ├── types/               # Type definitions
│   ├── constants/           # Shared constants
│   └── utils/               # Shared utilities
├── deployment/              # Deployment configurations
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
└── README.md               # This file
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB
- Redis
- Docker (optional)

### Development Setup

1. Clone the repository
2. Set up the backend:
   \`\`\`bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   \`\`\`

3. Set up the frontend (in a new terminal):
   \`\`\`bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   \`\`\`

4. Open your browser to http://localhost:3000

### Docker Setup

\`\`\`bash
# Using Docker Compose
docker-compose -f deployment/docker-compose.yml up -d

# Using Podman Compose
podman-compose -f deployment/podman-compose.yml up -d
\`\`\`

## Content Moderation

This application includes AI-powered content moderation features to ensure tweets comply with country-specific regulations. The moderation system checks for:

- Hate speech and discriminatory language
- Threats and violent content
- Harassment and bullying
- Country-specific legal requirements

## API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions to various platforms.

## License

This project is licensed under the MIT License.
EOF

    print_info "Shared resources created successfully!"
}

# Main script execution
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Twitter Clone Project Setup Script   ${NC}"
echo -e "${YELLOW}========================================${NC}"

# Check if projects already exist
if [ -d "backend" ] || [ -d "frontend" ]; then
    print_error "Project directories already exist. Please remove them or run in a different location."
    exit 1
fi

# Create projects
create_backend
create_frontend
create_shared

echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "1. Backend: cd backend && npm install"
echo "2. Frontend: cd frontend && npm install"
echo "3. Configure environment variables in both projects"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm start"
echo -e "${YELLOW}========================================${NC}"
