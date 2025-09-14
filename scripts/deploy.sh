#!/bin/bash

# Twitter Clone Deployment Script
# This script deploys the Twitter clone to production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
TAG=${2:-latest}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-ghcr.io}
DOCKER_NAMESPACE=${DOCKER_NAMESPACE:-your-namespace}

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
    local dependencies=("docker" "docker-compose" "git" "openssl")
    local missing=()

    for cmd in "${dependencies[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            missing+=("$cmd")
        fi
    done

    if [ ${#missing[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing[*]}"
        exit 1
    fi
}

# Load environment configuration
load_config() {
    if [ ! -f .env.${ENVIRONMENT} ]; then
        print_error "Environment file .env.${ENVIRONMENT} not found"
        exit 1
    fi
    
    print_status "Loading configuration for ${ENVIRONMENT} environment..."
    export $(grep -v '^#' .env.${ENVIRONMENT} | xargs)
}

# Build and push Docker images
build_and_push_images() {
    print_status "Building and pushing Docker images..."
    
    # Login to Docker registry
    if [ ! -z "$DOCKER_USERNAME" ] && [ ! -z "$DOCKER_PASSWORD" ]; then
        print_info "Logging in to Docker registry..."
        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin "$DOCKER_REGISTRY"
    fi
    
    # Build and push backend
    print_info "Building backend image..."
    docker build -t ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/twitter-clone-backend:${TAG} ../backend -f ../backend/Dockerfile.production
    
    print_info "Pushing backend image..."
    docker push ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/twitter-clone-backend:${TAG}
    
    # Build and push frontend
    print_info "Building frontend image..."
    docker build -t ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/twitter-clone-frontend:${TAG} ../frontend -f ../frontend/Dockerfile.production
    
    print_info "Pushing frontend image..."
    docker push ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/twitter-clone-frontend:${TAG}
}

# Deploy to production
deploy_production() {
    print_status "Deploying to production..."
    
    # Pull latest images
    print_info "Pulling latest images..."
    docker-compose -f docker-compose.production.yml pull
    
    # Stop and remove old containers
    print_info "Stopping old containers..."
    docker-compose -f docker-compose.production.yml down
    
    # Start new containers
    print_info "Starting new containers..."
    docker-compose -f docker-compose.production.yml up -d
    
    # Run database migrations
    print_info "Running database migrations..."
    docker-compose -f docker-compose.production.yml exec backend npm run migrate
    
    # Run database seeding if needed
    if [ "$SEED_DATABASE" = "true" ]; then
        print_info "Seeding database..."
        docker-compose -f docker-compose.production.yml exec backend npm run seed
    fi
    
    # Wait for services to be healthy
    print_info "Waiting for services to be healthy..."
    sleep 30
    
    # Run health check
    print_info "Running health check..."
    if curl -f http://localhost:${PORT:-80}/health; then
        print_status "Health check passed!"
    else
        print_error "Health check failed!"
        exit 1
    fi
}

# Deploy to staging
deploy_staging() {
    print_status "Deploying to staging..."
    
    # Use docker-compose for staging
    docker-compose -f docker-compose.staging.yml down
    docker-compose -f docker-compose.staging.yml up -d --build
    
    # Run migrations
    docker-compose -f docker-compose.staging.yml exec backend npm run migrate
}

# Perform rolling update
rolling_update() {
    print_status "Performing rolling update..."
    
    # Update backend first
    print_info "Updating backend..."
    docker-compose -f docker-compose.production.yml up -d --no-deps backend
    
    # Wait for backend to be healthy
    print_info "Waiting for backend to be healthy..."
    sleep 20
    
    # Update frontend
    print_info "Updating frontend..."
    docker-compose -f docker-compose.production.yml up -d --no-deps frontend
    
    # Clean up old images
    print_info "Cleaning up old images..."
    docker image prune -af
}

# Setup SSL certificates
setup_ssl() {
    if [ "$ENABLE_SSL" = "true" ] && [ ! -f ./nginx/ssl/cert.pem ]; then
        print_status "Setting up SSL certificates..."
        
        mkdir -p ./nginx/ssl
        
        # Generate self-signed certificate (for testing)
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ./nginx/ssl/key.pem \
            -out ./nginx/ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Company/CN=localhost"
        
        print_status "SSL certificates generated"
    fi
}

# Backup database
backup_database() {
    if [ "$BACKUP_ENABLED" = "true" ]; then
        print_status "Backing up database..."
        
        local timestamp=$(date +%Y%m%d_%H%M%S)
        local backup_dir="./backups/${timestamp}"
        
        mkdir -p "$backup_dir"
        
        # MongoDB backup
        docker-compose exec mongodb mongodump \
            --uri="mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@localhost:27017" \
            --out="/backup/${timestamp}"
        
        # Copy backup to host
        docker cp twitter-clone-mongodb:/backup/${timestamp} "$backup_dir"
        
        print_status "Database backed up to ${backup_dir}"
    fi
}

# Monitor deployment
monitor_deployment() {
    print_status "Monitoring deployment..."
    
    local attempts=0
    local max_attempts=10
    
    while [ $attempts -lt $max_attempts ]; do
        if curl -s -f "http://localhost:${PORT:-80}/health" > /dev/null; then
            print_status "Deployment successful! 🎉"
            return 0
        fi
        
        attempts=$((attempts + 1))
        print_info "Waiting for application to be ready... (attempt $attempts/$max_attempts)"
        sleep 10
    done
    
    print_error "Deployment failed - application not responding"
    return 1
}

# Show deployment information
show_deployment_info() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}       Deployment Complete               ${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Environment:${NC} ${ENVIRONMENT}"
    echo -e "${BLUE}Tag:${NC} ${TAG}"
    echo -e "${BLUE}Timestamp:${NC} $(date)"
    echo ""
    echo -e "${BLUE}Services:${NC}"
    echo -e "  Frontend:    http://${DOMAIN:-localhost}:${PORT:-80}"
    echo -e "  Backend API: http://${DOMAIN:-localhost}:${PORT:-80}/api"
    echo -e "  Health:      http://${DOMAIN:-localhost}:${PORT:-80}/health"
    echo ""
    echo -e "${BLUE}Monitoring:${NC}"
    echo -e "  Logs:        docker-compose logs -f"
    echo -e "  Status:      docker-compose ps"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo -e "  1. Verify the application is running correctly"
    echo -e "  2. Check application logs for any errors"
    echo -e "  3. Test critical functionality"
    echo -e "${GREEN}========================================${NC}"
}

# Main deployment function
deploy() {
    print_status "Starting deployment to ${ENVIRONMENT}..."
    
    check_dependencies
    load_config
    setup_ssl
    
    case "$ENVIRONMENT" in
        production)
            backup_database
            build_and_push_images
            deploy_production
            rolling_update
            ;;
        staging)
            deploy_staging
            ;;
        *)
            print_error "Unknown environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
    
    monitor_deployment
    show_deployment_info
}

# Rollback function
rollback() {
    print_status "Rolling back deployment..."
    
    # Get previous tag from backup
    local previous_tag=$(docker images --filter "reference=*twitter-clone*" --format "{{.Tag}}" | grep -v latest | sort -r | head -2 | tail -1)
    
    if [ -z "$previous_tag" ]; then
        print_error "No previous version found for rollback"
        exit 1
    fi
    
    print_info "Rolling back to tag: $previous_tag"
    TAG=$previous_tag deploy_production
}

# Usage information
usage() {
    echo "Usage: $0 [environment] [tag]"
    echo "  environment: production, staging (default: production)"
    echo "  tag: Docker image tag (default: latest)"
    echo ""
    echo "Examples:"
    echo "  $0 production           # Deploy latest to production"
    echo "  $0 staging v1.2.3       # Deploy v1.2.3 to staging"
    echo "  $0 rollback             # Rollback to previous version"
}

# Handle command line arguments
case "${1:-}" in
    -h|--help)
        usage
        exit 0
        ;;
    rollback)
        rollback
        exit 0
        ;;
    *)
        deploy "$@"
        ;;
esac
