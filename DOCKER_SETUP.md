# Docker Setup Guide for AutoShop

This guide walks you through running AutoShop with Docker and Docker Compose.

## Prerequisites

- **Docker** ([Install](https://docs.docker.com/get-docker/))
- **Docker Compose** ([Install](https://docs.docker.com/compose/install/))

## Quick Start

### 1. Configure Environment Variables

```bash
# Copy the Docker environment template
cp .env.docker .env

# Edit .env with your configuration
nano .env
```

**At minimum, update:**
- `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_KEY` (from stripe.com)
- `JWT_SECRET` (use a strong random string)
- `DB_PASSWORD` (change from default)

### 2. Build and Start Services

```bash
# Build images and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

**Services will start at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

### 3. Verify Everything is Running

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Common Commands

### Start Services
```bash
# Start in foreground (see logs)
docker-compose up

# Start in background
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Data
```bash
docker-compose down -v
```

### Rebuild Services
```bash
docker-compose up --build
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 50 lines
docker-compose logs --tail=50
```

### Access Database

```bash
# Connect to PostgreSQL shell
docker-compose exec postgres psql -U autoshop -d autoshop_db

# Example queries:
# \dt                    - List tables
# \q                     - Exit
```

### Run Database Commands

```bash
# Reset database (careful!)
docker-compose down -v
docker-compose up

# Manually run migrations
docker-compose exec backend npm run migrate
```

## Development Workflow

### Edit Code

Changes to your local files are **NOT** automatically reflected in the container. You have two options:

**Option 1: Hot Reload (Recommended)**
- Frontend: Next.js has built-in hot reload. Changes to `frontend/` files will auto-refresh in browser.
- Backend: Add `--watch` to Node.js for file watching.

**Option 2: Rebuild**
```bash
# Rebuild and restart a service
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Update Dependencies

```bash
# Add a new package (backend)
docker-compose exec backend npm install package-name
docker-compose up -d --build backend

# Add a new package (frontend)
docker-compose exec frontend npm install package-name
docker-compose up -d --build frontend
```

### Database Management

```bash
# Access Prisma Studio (database UI)
docker-compose exec backend npm run db:studio

# Manual query
docker-compose exec postgres psql -U autoshop -d autoshop_db -c "SELECT * FROM users;"
```

## Production Setup

### Environment Variables

Create a `.env.production` file with production values:

```bash
NODE_ENV=production
DB_PASSWORD=<strong-random-password>
JWT_SECRET=<strong-random-secret>
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_KEY=pk_live_...
```

### Build Images

```bash
# Build production images
docker-compose build

# Tag for registry (e.g., Docker Hub)
docker tag autoshop-backend myregistry/autoshop-backend:latest
docker tag autoshop-frontend myregistry/autoshop-frontend:latest

# Push to registry
docker push myregistry/autoshop-backend:latest
docker push myregistry/autoshop-frontend:latest
```

### Deploy

Popular deployment platforms:
- **Railway** - Simple, auto-deploys from Git
- **Render** - Free tier available, good for side projects
- **AWS ECS** - Scalable, for production workloads
- **DigitalOcean App Platform** - Simple Docker deployment
- **Heroku** - Container registry support

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Kill the process
kill -9 <PID>

# Or change ports in .env
FRONTEND_PORT=3010
BACKEND_PORT=3011
DB_PORT=5433
```

### Database Connection Error

```bash
# Check if postgres is healthy
docker-compose ps postgres

# View postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Backend Won't Start

```bash
# Check backend logs
docker-compose logs backend

# Verify database connection
docker-compose logs postgres

# Common issue: migrations failed
docker-compose down -v
docker-compose up --build
```

### Frontend Shows Blank Page

```bash
# Check frontend logs
docker-compose logs frontend

# Verify backend is running
docker-compose logs backend

# Check NEXT_PUBLIC_API_URL in .env
```

### Rebuild Everything from Scratch

```bash
# Remove containers, volumes, and networks
docker-compose down -v

# Remove images
docker rmi autoshop-backend autoshop-frontend

# Start fresh
docker-compose up --build
```

## Volume Mounts

The `docker-compose.yml` mounts these directories for development:

- `./backend/uploads` → `/app/uploads` - Product images
- `./backend/src` → `/app/src` - Backend source code (hot reload)

To mount frontend source:
```yaml
volumes:
  - ./frontend:/app
  - /app/node_modules
  - /app/.next
```

## Health Checks

Services include health checks that restart them if they fail:

```bash
# View health status
docker-compose ps

# STATUS column shows "Up (healthy)" or "Up (unhealthy)"
```

## Network Communication

Services communicate via container names on the `autoshop-network`:

- Backend talks to database as `postgres:5432`
- Frontend talks to backend as `backend:3001`
- External connections use `localhost:PORT`

## Useful Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## Next Steps

1. ✅ Configure `.env` with your API keys
2. ✅ Run `docker-compose up --build`
3. ✅ Open http://localhost:3000
4. ✅ Add your products to the database
5. ✅ Deploy to your preferred platform

Happy shipping! 🚀
