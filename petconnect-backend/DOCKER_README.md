# Docker Setup for PetConnect Backend

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)

## Quick Start

### 1. Start the Application
```bash
# Build and start all services (backend + MongoDB)
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 2. Stop the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

## Services

### Backend API
- **Port:** 5000
- **URL:** http://localhost:5000
- **Container Name:** petconnect-backend
- **Hot Reload:** Enabled (changes in src/ will auto-reload)

### MongoDB
- **Port:** 27017
- **Container Name:** petconnect-mongodb
- **Username:** admin
- **Password:** petconnect123
- **Database:** petconnect

## Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# MongoDB only
docker-compose logs -f mongodb
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart backend only
docker-compose restart backend
```

### Access Container Shell
```bash
# Backend container
docker exec -it petconnect-backend sh

# MongoDB container
docker exec -it petconnect-mongodb mongosh
```

### View Running Containers
```bash
docker-compose ps
```

### Rebuild After Changes
```bash
# Rebuild and restart
docker-compose up --build

# Force rebuild (no cache)
docker-compose build --no-cache
docker-compose up
```

## Environment Variables

The docker-compose.yml includes default environment variables. For production or custom configuration:

1. Create a `.env` file in the backend directory
2. Add your environment variables
3. Update docker-compose.yml to use the .env file

## Volumes

### Persistent Data
- **mongodb_data:** MongoDB database files
- **mongodb_config:** MongoDB configuration files
- **./uploads:** File uploads (mounted from host)

### Development Volumes
- **./src:** Source code (hot reload)
- **./server.js:** Main server file

## Network

All services run on the `petconnect-network` bridge network, allowing them to communicate with each other.

## Production Deployment

For production, use the standard Dockerfile:

```bash
# Build production image
docker build -t petconnect-backend:latest .

# Run production container
docker run -d \
  -p 5000:5000 \
  --name petconnect-backend \
  --env-file .env \
  petconnect-backend:latest
```

## Troubleshooting

### Port Already in Use
If port 5000 or 27017 is already in use:
```bash
# Stop the conflicting process or change ports in docker-compose.yml
ports:
  - "5001:5000"  # Change host port
```

### MongoDB Connection Issues
```bash
# Check MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Backend Not Starting
```bash
# View backend logs
docker-compose logs backend

# Check for errors in code
# Rebuild with no cache
docker-compose build --no-cache backend
docker-compose up backend
```

### Clear Everything and Start Fresh
```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker rmi petconnect-backend

# Rebuild and start
docker-compose up --build
```

## Health Checks

### Check Backend Health
```bash
curl http://localhost:5000/health
```

### Check MongoDB Connection
```bash
docker exec -it petconnect-mongodb mongosh -u admin -p petconnect123
```

## Development Workflow

1. Make code changes in `src/` directory
2. Changes are automatically detected and server restarts
3. Test your changes at http://localhost:5000
4. View logs with `docker-compose logs -f backend`

## Notes

- The backend runs with `nodemon` for automatic restarts on code changes
- MongoDB data persists across container restarts
- Uploads directory is mounted from host for easy access
- All logs are visible in Docker Desktop or via `docker-compose logs`
