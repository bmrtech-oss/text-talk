#!/bin/bash

# Twitter Clone Setup Script
# This script sets up the development environment for the Twitter clone

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[+]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[!]${NC} $1"
}

# Check if required commands are available
check_dependencies() {
    local dependencies=("node" "npm" "docker" "docker-compose" "git")
    local missing=()

    for cmd in "${dependencies[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            missing+=("$cmd")
        fi
    done

    if [ ${#missing[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing[*]}"
        print_info "Please install the missing dependencies and run the script again."
        exit 1
    fi
}

# Generate random secret
generate_secret() {
    openssl rand -base64 32 | tr -d '\n'
}

# Create environment files
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Backend .env
    if [ ! -f ../backend/.env ]; then
        cat > ../backend/.env << EOF
# Database
MONGO_URI=mongodb://localhost:27017/twitter-clone
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=$(generate_secret)
JWT_EXPIRES_IN=7d

# App
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Moderation (Optional)
MODERATION_API_KEY=your_moderation_api_key_here

# Logging
LOG_LEVEL=info

# Email (Optional - for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@yourdomain.com
EOF
        print_status "Created backend/.env"
    else
        print_info "backend/.env already exists"
    fi

    # Frontend .env
    if [ ! -f ../frontend/.env ]; then
        cat > ../frontend/.env << EOF
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000

# Moderation
REACT_APP_MODERATION_API_KEY=your_moderation_api_key_here

# Analytics (Optional)
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_tracking_id

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_OFFLINE=true
EOF
        print_status "Created frontend/.env"
    else
        print_info "frontend/.env already exists"
    fi

    # Docker .env
    if [ ! -f .env ]; then
        cat > .env << EOF
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=$(generate_secret)
MONGO_USERNAME=twitter_user
MONGO_PASSWORD=$(generate_secret)
MONGO_DATABASE=twitter_clone

# Redis
REDIS_PASSWORD=$(generate_secret)
REDIS_COMMANDER_PASSWORD=$(generate_secret)

# JWT
JWT_SECRET=$(generate_secret)

# Moderation
MODERATION_API_KEY=your_moderation_api_key_here

# URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
WS_URL=ws://localhost:5000

# Mongo Express
MONGO_EXPRESS_PASSWORD=$(generate_secret)

# Optional Features
ENABLE_REDIS_COMMANDER=true
ENABLE_MONGO_EXPRESS=true
ENABLE_NGINX=false
EOF
        print_status "Created deployment/.env"
    else
        print_info "deployment/.env already exists"
    fi
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    
    cd ../backend
    
    if [ ! -d node_modules ]; then
        print_info "Installing backend dependencies..."
        npm install
    else
        print_info "Backend dependencies already installed"
    fi
    
    cd - > /dev/null
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd ../frontend
    
    if [ ! -d node_modules ]; then
        print_info "Installing frontend dependencies..."
        npm install
    else
        print_info "Frontend dependencies already installed"
    fi
    
    cd - > /dev/null
}

# Initialize database
init_database() {
    print_status "Initializing database..."
    
    # Create database initialization script
    cat > ../database/init-mongo.js << EOF
db = db.getSiblingDB('twitter_clone');

// Create user for application
db.createUser({
  user: 'twitter_user',
  pwd: '$MONGO_PASSWORD',
  roles: [
    {
      role: 'readWrite',
      db: 'twitter_clone'
    }
  ]
});

// Create collections
db.createCollection('users');
db.createCollection('tweets');
db.createCollection('moderationlogs');

// Create indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.tweets.createIndex({ author: 1, createdAt: -1 });
db.tweets.createIndex({ hashtags: 1 });
db.moderationlogs.createIndex({ createdAt: -1 });

print('Database initialized successfully');
EOF
    
    print_status "Database initialization script created"
}

# Build Docker images
build_docker_images() {
    print_status "Building Docker images..."
    
    # Build backend image
    print_info "Building backend image..."
    docker build -t twitter-clone-backend ../backend -f ../backend/Dockerfile.production
    
    # Build frontend image
    print_info "Building frontend image..."
    docker build -t twitter-clone-frontend ../frontend -f ../frontend/Dockerfile.production
    
    print_status "Docker images built successfully"
}

# Start development services
start_development() {
    print_status "Starting development services..."
    
    # Start MongoDB and Redis
    docker-compose up -d mongodb redis
    
    # Wait for services to be ready
    print_info "Waiting for services to start..."
    sleep 10
    
    # Start backend in development mode
    print_info "Starting backend development server..."
    cd ../backend
    npm run dev &
    BACKEND_PID=$!
    cd - > /dev/null
    
    # Start frontend development server
    print_info "Starting frontend development server..."
    cd ../frontend
    npm start &
    FRONTEND_PID=$!
    cd - > /dev/null
    
    print_status "Development servers started (PIDs: backend=$BACKEND_PID, frontend=$FRONTEND_PID)"
}

# Display setup information
show_info() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}       Twitter Clone Setup Complete      ${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Development Services:${NC}"
    echo -e "  Backend API:    http://localhost:5000"
    echo -e "  Frontend App:   http://localhost:3000"
    echo -e "  MongoDB:        mongodb://localhost:27017"
    echo -e "  Redis:          redis://localhost:6379"
    echo ""
    echo -e "${BLUE}Management Interfaces:${NC}"
    echo -e "  Redis Commander: http://localhost:8081"
    echo -e "  Mongo Express:   http://localhost:8082"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo -e "  1. Update the .env files with your actual API keys"
    echo -e "  2. Run 'npm run dev' in both backend and frontend folders"
    echo -e "  3. Open http://localhost:3000 in your browser"
    echo ""
    echo -e "${YELLOW}Note:${NC} The development servers are running in the background."
    echo -e "      Use 'kill $BACKEND_PID $FRONTEND_PID' to stop them."
    echo -e "${GREEN}========================================${NC}"
}

# Main execution
main() {
    print_status "Starting Twitter Clone setup..."
    
    # Check dependencies
    check_dependencies
    
    # Setup environment
    setup_environment
    
    # Load environment variables
    if [ -f .env ]; then
        export $(grep -v '^#' .env | xargs)
    fi
    
    # Initialize database
    init_database
    
    # Install dependencies
    setup_backend
    setup_frontend
    
    # Build Docker images
    build_docker_images
    
    # Start development services
    start_development
    
    # Show information
    show_info
    
    print_status "Setup completed successfully! 🎉"
}

# Handle script interruption
cleanup() {
    print_warning "Script interrupted. Cleaning up..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    # Stop Docker services
    docker-compose down
    
    exit 1
}

# Set up trap for cleanup
trap cleanup INT TERM

# Run main function
main "$@"