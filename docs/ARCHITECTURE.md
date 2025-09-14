## 2. docs/ARCHITECTURE.md

```markdown
# Twitter Clone Architecture

## System Overview

The Twitter Clone is a modern microservices-based social media platform built with Node.js, React, MongoDB, and Redis. The architecture is designed for scalability, reliability, and maintainability.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Load Balancer │
│   (React)       │◄──►│   (Nginx)       │◄──►│   (Cloud)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Backend API   │    │   Auth Service  │    │   Moderation    │
│   (Node.js)     │    │   (Node.js)     │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MongoDB       │    │   Redis         │    │   External APIs │
│   (Database)    │    │   (Cache)       │    │   (Moderation)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Redis** - In-memory data store
- **JWT** - Authentication tokens
- **Socket.io** - Real-time communication

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container apps
- **Nginx** - Reverse proxy & load balancing
- **PM2** - Process manager

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Husky** - Git hooks

## System Components

### 1. Frontend Application

#### Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API service layer
│   ├── contexts/      # React contexts
│   ├── utils/         # Utility functions
│   └── styles/        # Global styles
```

#### Key Features
- Responsive design with mobile-first approach
- Theme support (light/dark/orange)
- Real-time updates via WebSocket
- Offline capability with service workers
- Progressive Web App (PWA) features

### 2. Backend API

#### Structure
```
backend/
├── src/
│   ├── controllers/   # Route handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── config/        # Configuration files
│   ├── utils/         # Utility functions
│   └── tests/         # Test files
```

#### API Layers
1. **Routes Layer** - HTTP endpoint definitions
2. **Controllers Layer** - Business logic handlers
3. **Services Layer** - Data processing and external calls
4. **Models Layer** - Database operations

### 3. Database Layer

#### MongoDB Collections
- **users** - User profiles and authentication
- **tweets** - Tweet content and metadata
- **moderationlogs** - Content moderation history
- **sessions** - User sessions (optional)

#### Indexes
```javascript
// Users collection
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

// Tweets collection
db.tweets.createIndex({ author: 1, createdAt: -1 });
db.tweets.createIndex({ hashtags: 1 });
db.tweets.createIndex({ "location.coordinates": "2dsphere" });
```

### 4. Caching Layer

#### Redis Usage
- **Session storage** - User authentication sessions
- **Rate limiting** - Request rate limiting data
- **Timeline caching** - Cached user timelines
- **Real-time data** - WebSocket connection management

### 5. Moderation Service

#### Architecture
```
Request → Content Check → [AI Service] → Moderation Result → Action
```

#### Integration Points
- **Perspective API** - Toxicity detection
- **Custom Rules** - Platform-specific guidelines
- **Manual Review** - Human moderation queue

## Data Flow

### Tweet Creation Flow
1. User submits tweet from frontend
2. Frontend validates content locally
3. API receives tweet and validates
4. Content sent to moderation service
5. If approved, tweet saved to database
6. Tweet added to author's followers' timelines
7. Real-time update sent to connected clients
8. Response returned to frontend

### Authentication Flow
1. User provides credentials
2. Backend validates and creates JWT
3. Token stored in secure HTTP-only cookie
4. Redis stores session data
5. Subsequent requests validated via middleware
6. Token refreshed automatically

## Scalability Design

### Horizontal Scaling
- **Stateless API** - API servers can be scaled horizontally
- **Load Balancing** - Nginx distributes traffic
- **Database Sharding** - MongoDB sharding ready
- **Redis Cluster** - Redis cluster for high availability

### Performance Optimizations
- **Database Indexing** - Optimized query performance
- **Query Optimization** - Efficient database queries
- **Caching Strategy** - Multi-layer caching
- **CDN Integration** - Static assets delivery

### Monitoring and Logging
- **Application Metrics** - Response times, error rates
- **Database Metrics** - Query performance, connection pool
- **Infrastructure Metrics** - CPU, memory, disk usage
- **Centralized Logging** - Log aggregation and analysis

## Security Architecture

### Authentication
- JWT-based authentication
- Secure token storage
- Token rotation and expiration
- Password hashing with bcrypt

### Authorization
- Role-based access control
- Resource-level permissions
- Rate limiting per endpoint
- IP-based restrictions

### Data Protection
- HTTPS encryption
- Data encryption at rest
- Secure headers (CSP, HSTS)
- Input validation and sanitization

### API Security
- Rate limiting
- Request validation
- SQL injection prevention
- XSS and CSRF protection

## Deployment Architecture

### Development Environment
```
Local Machine → Docker Compose → [API, DB, Redis, Frontend]
```

### Staging Environment
```
Cloud Provider → Docker Swarm/Kubernetes → [Services]
```

### Production Environment
```
Cloud Provider → Kubernetes Cluster → [Services + Monitoring]
```

### CI/CD Pipeline
```
Git Push → CI Server → Test → Build → Deploy → Monitor
```

## Database Design

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,      // Unique
  email: String,         // Unique
  password: String,      // Hashed
  name: String,
  bio: String,
  avatar: String,
  coverPhoto: String,
  location: String,
  website: String,
  followers: [ObjectId], // User references
  following: [ObjectId], // User references
  isVerified: Boolean,
  isActive: Boolean,
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Tweets Collection
```javascript
{
  _id: ObjectId,
  content: String,
  author: ObjectId,      // User reference
  likes: [ObjectId],     // User references
  retweets: [ObjectId],  // User references
  replies: [ObjectId],   // Tweet references
  replyTo: ObjectId,     // Tweet reference
  quoteTweet: ObjectId,  // Tweet reference
  media: [String],       // URLs
  hashtags: [String],
  mentions: [ObjectId],  // User references
  viewCount: Number,
  isEdited: Boolean,
  editHistory: [Object],
  moderationStatus: String,
  moderationDetails: Object,
  location: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## API Design Principles

### RESTful Design
- Resource-based endpoints
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Consistent response formats
- Proper status codes

### Versioning
- URL versioning (`/api/v1/endpoint`)
- Backward compatibility
- Deprecation policies

### Documentation
- OpenAPI/Swagger documentation
- Example requests and responses
- Error code documentation

## Monitoring and Alerting

### Application Monitoring
- **Performance** - Response times, throughput
- **Errors** - Exception tracking, error rates
- **Usage** - API usage patterns, feature adoption

### Infrastructure Monitoring
- **Resource Usage** - CPU, memory, disk, network
- **Service Health** - Database, cache, external services
- **Capacity Planning** - Growth trends, scaling needs

### Alerting
- **Critical Errors** - Immediate notification
- **Performance Degradation** - Warning alerts
- **Capacity Issues** - Proactive notifications

## Disaster Recovery

### Backup Strategy
- **Database Backups** - Daily automated backups
- **Configuration Backups** - Version-controlled configs
- **Media Backups** - CDN with redundancy

### Recovery Procedures
- **Database Restoration** - Point-in-time recovery
- **Service Restoration** - Automated deployment
- **Data Validation** - Post-recovery verification

### High Availability
- **Multi-region Deployment** - Geographic redundancy
- **Load Balancing** - Traffic distribution
- **Failover Mechanisms** - Automatic service recovery

## Future Considerations

### Scalability Improvements
- **Microservices Architecture** - Split monolith into services
- **Event-Driven Architecture** - Kafka/RabbitMQ for events
- **GraphQL API** - Flexible querying capabilities

### Feature Enhancements
- **Advanced Search** - Elasticsearch integration
- **Media Processing** - Image/video processing pipeline
- **Machine Learning** - Personalized content recommendations

### Infrastructure Evolution
- **Serverless Functions** - AWS Lambda/Azure Functions
- **Edge Computing** - Cloudflare Workers
- **Container Orchestration** - Kubernetes migration
```

