# Financial Platform

A secure and scalable financial platform with authentication, session management, and notification capabilities.

## Features

- **Authentication System**
  - User registration with conflict detection
  - Secure password management
  - Session handling
  - Email verification flow

- **Email Notifications**
  - Sign-in verification emails
  - Password reset notifications
  - Secure token delivery
  - Error handling and monitoring

- **Redis Integration**
  - Session storage
  - Token management
  - Data caching
  - TTL support

- **Security**
  - CSRF protection
  - Rate limiting
  - Brute force prevention
  - Helmet security headers

## Setup

### Prerequisites

- Node.js 18+
- Redis server
- PostgreSQL database
- SMTP server or notification service

### Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# Email Service
NOTIF_EMAIL_SERVICE_BASE_URI=https://notification-service.example.com
NOTIF_EMAIL_SERVICE_API_KEY=your-api-key-here

# Security
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
```

## Architecture

### Services

- **AuthService**: User authentication and management
- **NotificationService**: Email notifications and verification
- **RedisService**: Cache and session management

### Security Measures

- CSRF tokens for form submission
- Rate limiting on authentication endpoints
- Brute force protection
- Secure session management
- HTTP security headers

### Logging

Uses Winston logger with:
- Multiple log levels
- Daily rotate file
- Separate error logs
- Production/development modes

## Error Handling

Comprehensive error handling across all services:
- Database connection errors
- Redis connection issues
- Email service failures
- Authentication failures
- Rate limiting
- Validation errors

## Development

```bash
# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Production Deployment

1. Set all environment variables
2. Run database migrations
3. Build the application
4. Start with process manager (PM2 recommended)

## Monitoring

- Winston logs in `/logs` directory
- Error tracking in `/logs/error.log`
- Redis connection monitoring
- Email service status tracking