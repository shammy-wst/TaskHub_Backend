# TaskHub Backend - v1.0.0 Release Notes

## 📋 Project Overview

TaskHub is a task management application designed to help users organize and track their tasks efficiently. The backend provides a robust API supporting user authentication and complete task management functionality.

## 🎯 Project Goals

- Provide secure user authentication
- Enable CRUD operations for tasks
- Ensure data persistence with PostgreSQL
- Support multiple environments (dev/prod)
- Maintain high security standards
- Enable seamless frontend integration

## 🚀 Getting Started

### Prerequisites

```bash
node -v      # Must be >= 14.x
npm -v       # Must be >= 6.x
postgresql --version # Must be >= 12
```

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-username/taskhub-backend.git
cd taskhub-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your .env file with your values
# Edit the following variables:
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=taskhub
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000

# Create database
createdb taskhub

# Run migrations
npm run migrate

# Optional: Seed database
npm run seed

# Start development server
npm run dev

# For production
npm start
```

### Testing

```bash
# Create test database
createdb taskhub_test

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🐳 Docker Configuration

### Prerequisites

```bash
docker -v            # Must be >= 20.x
docker-compose -v    # Must be >= 2.x
```

### Docker Files

#### Dockerfile

```dockerfile
# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3001

# Start command
CMD ["npm", "start"]
```

#### docker-compose.yml

```yaml
version: "3.8"
services:
  # Backend API
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      PORT: 3001
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_NAME: taskhub
      JWT_SECRET: your_jwt_secret
    depends_on:
      - postgres
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    command: npm run dev

  # PostgreSQL Database
  postgres:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: taskhub
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Docker Commands

```bash
# Build and start containers
docker-compose up --build

# Start containers in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f api

# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d taskhub

# Run migrations in Docker
docker-compose exec api npm run migrate

# Run tests in Docker
docker-compose exec api npm test

# Clean up all containers and volumes
docker-compose down -v
```

### Production Docker Setup

```bash
# Build production image
docker build -t taskhub-backend:prod -f Dockerfile.prod .

# Run production container
docker run -d   -p 3001:3001   --name taskhub-backend   -e NODE_ENV=production   -e DATABASE_URL=your_production_db_url   -e JWT_SECRET=your_production_secret   taskhub-backend:prod
```

### Docker Best Practices

- Multi-stage builds for production
- Non-root user for security
- .dockerignore for faster builds
- Environment variables for configuration
- Volume mounting for development
- Health checks for container monitoring

### Docker Compose Profiles

```yaml
# Development profile
docker-compose --profile dev up

# Testing profile
docker-compose --profile test up

# Production profile
docker-compose --profile prod up
```

### Container Health Monitoring

```bash
# Check container status
docker ps

# Monitor container resources
docker stats

# View container logs
docker logs -f taskhub-backend

# Inspect container
docker inspect taskhub-backend
```

### Troubleshooting

```bash
# Rebuild containers
docker-compose up --build --force-recreate

# Clean up unused resources
docker system prune

# Check container networks
docker network ls

# Verify volume mounts
docker volume ls
```
