# Twitter Clone with Content Moderation

A full-stack Twitter-like social media platform with AI-powered content moderation to ensure compliance with country-specific laws and regulations.

## Project Structure

```
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
```

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
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. Set up the frontend (in a new terminal):
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

4. Open your browser to http://localhost:3000

### Docker Setup

```bash
# Using Docker Compose
docker-compose -f deployment/docker-compose.yml up -d

# Using Podman Compose
podman-compose -f deployment/podman-compose.yml up -d
```

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

## Key Features

1. Complete Authentication System - Login, register, JWT management
2. Content Moderation Integration - Real-time content checking
3. Tweet Management - Create, view, like, retweet functionality
4. User Profiles - Profile pages with follow/unfollow
5. Responsive Design - Mobile-first responsive layout
6. Theme Support - Light/dark/orange themes with system preference
7. State Management - React Query for server state, Context for app state
8. Form Handling - React Hook Form with comprehensive validation
9. Error Handling - Comprehensive error handling and user feedback
10. Performance Optimizations - Debouncing, throttling, pagination
11. Accessibility - ARIA labels, keyboard navigation, focus management
12. Type Safety - PropTypes and Joi schemas for validation

## Architecture Highlights:

1. Separation of Concerns - Clear separation between UI, business logic, and data fetching
2. Component Reusability - Reusable components with proper props interface
3. Service Layer - Centralized API communication
4. Hook Abstraction - Custom hooks for complex logic
5. Theme System - CSS variables for theming
6. Error Boundaries - Proper error handling at multiple levels
7. Loading States - Comprehensive loading state management
8. Pagination - Infinite scroll and traditional pagination
9. WebSocket Ready - Architecture prepared for real-time features
10. Modular Design - Easy to extend and maintain
11. The application is now complete and ready for development and deployment!

## Backend Developmemt Workflow

```bash
$ cd backend
$ npm install
$ cp .env.example .env
# Edit .env with your configuration
$ npm run dev
```

## Backend Developmemt Workflow

```bash
$ cd frontend
$ npm install
$ cp .env.example .env
# Edit .env with your configuration
$ npm start
```

## License

This project is licensed under the MIT License.
