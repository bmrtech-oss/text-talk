## 3. docs/DEPLOYMENT.md

```markdown
# Twitter Clone Deployment Guide

## Overview

This guide covers the deployment process for the Twitter Clone application across different environments (development, staging, production).

## Prerequisites

### Required Tools
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Node.js** (v18.0+)
- **npm** (v8.0+)
- **Git** (v2.0+)

### Optional Tools
- **kubectl** (for Kubernetes deployment)
- **AWS CLI** (for cloud deployment)
- **Terraform** (for infrastructure as code)

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/twitter-clone.git
cd twitter-clone
```

### 2. Environment Configuration

Create environment files for each environment:

#### Development (.env.development)
```bash
# Database
MONGO_URI=mongodb://localhost:27017/twitter-clone-dev
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_development_jwt_secret
JWT_EXPIRES_IN=7d

# App
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

#### Production (.env.production)
```bash
# Database
MONGO_URI=mongodb://mongodb:27017/twitter-clone
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your_production_jwt_secret_change_this
JWT_EXPIRES_IN=7d

# App
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com

# Moderation
MODERATION_API_KEY=your_actual_api_key
```


## Deployment Methods

### Method 1: Docker Compose (Recommended)

#### Development Deployment
```bash
# Start all services
cd deployment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Production Deployment
```bash
# Build and start production services
cd deployment
docker-compose -f docker-compose.production.yml up -d --build

# Monitor deployment
docker-compose -f docker-compose.production.yml logs -f
```

### Method 2: Manual Deployment

#### Backend Deployment
```bash
cd backend

# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

#### Frontend Deployment
```bash
cd frontend

# Install dependencies
npm install

# Build application
npm run build

# Serve built files
npx serve -s build -l 3000
```

### Method 3: Kubernetes Deployment

#### Create Kubernetes Cluster
```bash
# Using Minikube (local)
minikube start

# Using AWS EKS
eksctl create cluster --name twitter-cluster --region us-west-2
```

#### Apply Kubernetes Manifests
```bash
# Apply all manifests
kubectl apply -f kubernetes/

# Verify deployment
kubectl get all -n twitter-clone
```

## Configuration Management

### Environment Variables

Required environment variables:

#### Backend Variables
```bash
# Database
MONGO_URI=mongodb://host:port/database
REDIS_URL=redis://host:port

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com

# Moderation
MODERATION_API_KEY=your_api_key

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

#### Frontend Variables
```bash
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com
REACT_APP_MODERATION_API_KEY=your_api_key
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id
```

### Database Configuration

#### MongoDB Setup
```bash
# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "admin_password",
  roles: ["root"]
})

# Create application database and user
use twitter_clone
db.createUser({
  user: "twitter_user",
  pwd: "user_password",
  roles: ["readWrite"]
})
```

#### Redis Setup
```bash
# Set Redis password in config
requirepass your_redis_password

# Or use environment variable
REDIS_PASSWORD=your_redis_password
```

## SSL/TLS Configuration

### Using Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure Nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

### Self-Signed Certificate (Development)
```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Company/CN=localhost"
```

## Load Balancer Configuration

### Nginx Configuration
```nginx
# Load balancing configuration
upstream backend {
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}

upstream frontend {
    server frontend1:3000;
    server frontend2:3000;
    server frontend3:3000;
}
```

### Health Checks
```nginx
# Health check endpoint
location /health {
    proxy_pass http://backend/health;
    access_log off;
}

# Health check for load balancer
server {
    listen 80;
    server_name health.yourdomain.com;
    
    location / {
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## Monitoring Setup

### Application Monitoring
```bash
# Install PM2 for process management
npm install -g pm2

# Start application with PM2
pm2 start ecosystem.config.js

# Monitor application
pm2 monit

# Setup logging
pm2 install pm2-logrotate
```

### Database Monitoring
```bash
# Enable MongoDB monitoring
db.setProfilingLevel(1, { slowms: 100 })

# Install MongoDB tools
mongostat
mongotop
```

### Infrastructure Monitoring
```bash
# Install Prometheus and Grafana
docker-compose -f monitoring/docker-compose.yml up -d
```

## Backup and Recovery

### Database Backups
```bash
# MongoDB backup
mongodump --uri="mongodb://username:password@host:port/database" \
  --out="/backup/$(date +%Y%m%d_%H%M%S)"

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR"
```

### Redis Backups
```bash
# Redis backup
redis-cli SAVE

# Or use RDB persistence
# In redis.conf:
save 900 1
save 300 10
save 60 10000
```

### Media Backup
```bash
# Sync media files to backup storage
aws s3 sync /app/uploads s3://your-bucket/uploads/
```

## Scaling Strategies

### Horizontal Scaling
```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Or using Kubernetes
kubectl scale deployment/backend --replicas=3
```

### Database Scaling
```bash
# Enable MongoDB sharding
sh.enableSharding("twitter_clone")

# Shard collections
sh.shardCollection("twitter_clone.tweets", { author: 1 })
```

### Cache Scaling
```bash
# Setup Redis cluster
redis-cli --cluster create \
  node1:6379 node2:6379 node3:6379 \
  --cluster-replicas 1
```

## Security Hardening

### Container Security
```bash
# Use non-root users in Docker
USER node

# Scan for vulnerabilities
docker scan your-image:tag

# Use security profiles
docker run --security-opt no-new-privileges your-image
```

### Network Security
```bash
# Configure firewalls
ufw allow 80
ufw allow 443
ufw allow 22
ufw enable

# Use security groups (AWS)
# Allow only necessary ports
```

### Application Security
```bash
# Regular dependency updates
npm audit
npm audit fix

# Security headers in Nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```

## Performance Optimization

### Database Optimization
```bash
# Create indexes
db.tweets.createIndex({ author: 1, createdAt: -1 })
db.users.createIndex({ username: 1 }, { unique: true })

# Monitor slow queries
db.setProfilingLevel(1, { slowms: 100 })
```

### Cache Optimization
```bash
# Configure Redis memory policy
maxmemory 1gb
maxmemory-policy allkeys-lru

# Use Redis pipelining
const pipeline = redis.pipeline();
pipeline.get('key1');
pipeline.get('key2');
pipeline.exec();
```

### CDN Configuration
```bash
# Configure CloudFront or similar CDN
# For static assets and media files
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MongoDB connection
mongosh "mongodb://username:password@host:port/database"

# Check Redis connection
redis-cli -h host -p port -a password PING
```

#### Application Issues
```bash
# Check application logs
docker-compose logs backend
docker-compose logs frontend

# Debug running containers
docker exec -it container_name sh
```

#### Network Issues
```bash
# Check network connectivity
ping yourdomain.com
telnet yourdomain.com 443

# Check DNS resolution
nslookup yourdomain.com
```

### Debug Commands
```bash
# View running containers
docker ps
docker-compose ps

# View resource usage
docker stats

# View logs in real-time
docker-compose logs -f

# Execute commands in containers
docker-compose exec backend npm run test
```

## Maintenance Tasks

### Regular Maintenance
```bash
# Update dependencies
npm update
docker-compose build --no-cache

# Clean up old images
docker image prune -a

# Rotate logs
logrotate /etc/logrotate.d/your-app
```

### Backup Verification
```bash
# Verify backups
mongorestore --uri="mongodb://localhost:27017" --drop /backup/latest/

# Test restore process
# Regular disaster recovery drills
```

### Performance Monitoring
```bash
# Monitor response times
curl -o /dev/null -s -w "%{time_total}\n" https://yourdomain.com

# Database performance
db.currentOp()
db.serverStatus()
```

## Rollback Procedures

### Application Rollback
```bash
# Revert to previous Docker image
docker-compose pull
docker-compose up -d

# Or use specific version
docker-compose up -d --image your-image:previous-version
```

### Database Rollback
```bash
# Restore from backup
mongorestore --uri="$MONGO_URI" --drop /backup/backup-date/
```

### Configuration Rollback
```bash
# Revert configuration changes
git checkout HEAD -- deployment/
docker-compose up -d --force-recreate
```

## Cost Optimization

### Resource Optimization
```bash
# Right-size containers
# Monitor and adjust resource limits

# Use spot instances for non-critical workloads
# Implement auto-scaling
```

### Storage Optimization
```bash
# Clean up old backups
find /backup -type f -mtime +30 -delete

# Compress backups
tar -czf backup.tar.gz /backup/latest/
```

### Network Optimization
```bash
# Use CDN for static assets
# Implement caching strategies
# Compress responses
gzip on;
gzip_types text/plain application/json;
```

## Support and Resources

### Documentation
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Redis Documentation](https://redis.io/documentation)
- [Nginx Documentation](https://nginx.org/en/docs/)

### Monitoring Tools
- **Prometheus** - Metrics collection
- **Grafana** - Dashboard visualization
- **ELK Stack** - Log management
- **Datadog** - Full-stack monitoring

### Support Channels
- GitHub Issues for bug reports
- Slack channel for team communication
- Monitoring alerts for production issues
- Regular maintenance windows for updates
```

These documentation files provide comprehensive coverage of:

1. **API Documentation** - Complete endpoint reference with examples
2. **Architecture Overview** - System design and technical decisions
3. **Deployment Guide** - Step-by-step deployment instructions

The documentation includes:
- Code examples for all endpoints
- Architecture diagrams and explanations
- Detailed deployment procedures
- Security considerations
- Monitoring and maintenance guidelines
- Troubleshooting sections
- Best practices for production deployment

This documentation will help developers understand the system, contribute effectively, and deploy the application successfully across different environments.