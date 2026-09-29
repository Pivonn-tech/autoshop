# Render Deployment Guide for AutoShop

## Current Fix Applied
1. ✅ Fixed missing `build` script in backend package.json
2. ✅ Added custom build script to handle Next.js prerendering errors
3. ✅ Updated root package.json to use custom build script

## Deployment Steps

### 1. Environment Variables (Required in Render Dashboard)
```
DATABASE_URL=postgresql://... (Render provides this for PostgreSQL)
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

### 2. Recommended Service Structure

**Option A: Single Web Service** (Current setup)
- Build Command: `npm install; npm run build`
- Start Command: `npm start`
- Port: 3001 (backend), 3000 (frontend) - needs proxy setup

**Option B: Separate Services** (Recommended)
- **Backend Service** (Web Service)
  - Build Command: `cd backend && npm install && npm run build`
  - Start Command: `npm start`
  - Health Check Path: `/health`
  
- **Frontend Service** (Static Site or Web Service)
  - Build Command: `cd frontend && npm install && npm run build`
  - Publish Directory: `frontend/.next`
  - OR as Web Service: `npm start`

### 3. Database Setup
1. Create PostgreSQL database on Render
2. Add DATABASE_URL to environment variables
3. Run migrations: `npx prisma migrate deploy`

### 4. Monitoring
- Check Render logs for errors
- Set up health check endpoints
- Monitor database connections

### 5. Troubleshooting

**Build fails:**
- Check Render logs for error details
- Verify all environment variables are set
- Ensure package.json scripts are correct

**App doesn't start:**
- Check PORT configuration
- Verify database connection
- Check CORS settings

**Frontend shows errors:**
- Verify API_URL environment variable
- Check CORS configuration on backend
- Ensure frontend build completed successfully