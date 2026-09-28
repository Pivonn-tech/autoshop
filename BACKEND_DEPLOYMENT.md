# Backend Deployment Guide

Your Express backend needs to be deployed separately from Vercel. This guide covers the recommended platforms.

## Quick Comparison

| Platform | Free Tier | Cost | Setup Time | PostgreSQL |
|----------|-----------|------|-----------|------------|
| Railway | ❌ | $5/mo minimum | 5 min | ✅ Included |
| Render | ✅ (limited) | $7/mo+ | 5 min | ✅ Included |
| Fly.io | ✅ (limited) | Pay-as-you-go | 10 min | ✅ Add-on |
| Heroku | ❌ | $7+/mo | 10 min | ✅ Add-on (paid) |

## Recommended: Railway.app

Railway is the fastest and most cost-effective option.

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub or email
3. Create new project

### Step 2: Add PostgreSQL Database

1. Click "Add Plugin"
2. Select "PostgreSQL"
3. Railway automatically creates the database and provides `DATABASE_URL`

### Step 3: Add Node.js Service

1. Click "New Service"
2. Select "GitHub Repo" 
3. Authorize and select your autoshop repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build` (if needed)
   - **Start Command**: `npm run start`

### Step 4: Set Environment Variables

In Railway dashboard, go to your Node.js service → Variables → Add:

```
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.vercel.app
JWT_SECRET=<generate-a-strong-random-key>
PORT=3001

# Optional email service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@autofixkenya.co.ke

# Optional AWS S3 (for image uploads)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

**Database variables** (auto-filled by Railway):
- `DATABASE_URL` - provided automatically

### Step 5: Deploy

Railway automatically deploys when you push to main branch.

1. Check deployment status in Railway dashboard
2. Click on your Node service → Deployments
3. View logs if issues occur

### Step 6: Get Your Backend URL

After successful deployment:
1. Go to your Node.js service settings
2. Find the deployment URL (e.g., `https://autoshop-api-prod.railway.app`)
3. Update your Vercel environment variable: `NEXT_PUBLIC_API_URL=https://autoshop-api-prod.railway.app/api`

### Step 7: Run Database Migrations

First deployment only:

```bash
# In Railway dashboard, click "Deployments" → expand your deployment → click "Deploy Logs"
# Or use Railway CLI:

railway shell
npm run migrate
exit
```

## Alternative: Render.com

If Railway doesn't work for you:

### Step 1: Create Account
- Go to https://render.com
- Sign up with GitHub

### Step 2: Create New Web Service
- Click "New +" → "Web Service"
- Connect your GitHub repo
- Select `backend` as root directory

### Step 3: Configure Service
- **Build Command**: `npm install`
- **Start Command**: `node src/index.js`
- **Plan**: Free (limited) or Paid

### Step 4: Add PostgreSQL Database
- Click "New +" → "PostgreSQL"
- Default settings are fine
- Note the `Internal Database URL`

### Step 5: Set Environment Variables
Add these in your Web Service settings:

```
NODE_ENV=production
DATABASE_URL=<paste Internal Database URL from PostgreSQL>
CORS_ORIGIN=https://yourdomain.vercel.app
JWT_SECRET=<random-key>
PORT=3001
```

### Step 6: Deploy
- Render automatically deploys on git push
- Monitor deployment in "Logs" tab

## Database URL Format

All platforms provide a `DATABASE_URL` in this format:

```
postgresql://username:password@host:5432/database_name
```

Prisma automatically reads this from the `DATABASE_URL` environment variable.

## Running Migrations

After first deployment, run migrations using your platform's CLI:

### Railway
```bash
railway shell
npm run migrate
exit
```

### Render
```bash
# Via Render shell (if available)
npm run migrate

# Or manually trigger via Render dashboard
```

### Fly.io
```bash
fly ssh console
npm run migrate
exit
```

## Health Check

Verify your backend is running:

```bash
curl https://your-backend-url/health
```

Should return:
```json
{
  "status": "OK",
  "uptime": 123.45
}
```

## Troubleshooting

### "Cannot connect to database"
- Verify `DATABASE_URL` is set correctly
- Check if database service is running
- Ensure migrations were run

### "CORS blocked"
- Update `CORS_ORIGIN` to match your Vercel domain
- Restart the service

### "Images not loading"
- Check `/uploads` directory exists
- Verify backend has read permissions
- Consider moving to AWS S3 for production

### "500 errors on API calls"
- Check backend logs in your platform's dashboard
- Look for missing environment variables
- Verify database connectivity

## Connecting to Live Database

For debugging, you can connect to your production database locally:

```bash
# With the DATABASE_URL from your platform:
psql postgresql://user:pass@host:5432/db_name

# Or with your Prisma Studio:
DATABASE_URL="postgresql://..." npm run db:studio
```

**⚠️ Be careful with production data!**

## Performance Optimization

For production:

1. **Enable connection pooling** (if available on your platform)
2. **Add database backups** (most platforms do this automatically)
3. **Monitor logs** for performance issues
4. **Use CDN for images** (consider AWS CloudFront or similar)

## Cost Examples

**Minimal production setup (~$5-10/month):**
- Railway: $5 (minimum spend)
- PostgreSQL: Included
- No additional services

**Advanced setup (~$15-30/month):**
- Render Web Service: $7
- Render PostgreSQL: $15
- AWS S3 for images: Pay-as-you-go (usually $0-5)

## Next Steps

1. Choose a platform (Railway recommended)
2. Create account and deploy
3. Note your backend URL
4. Update Vercel `NEXT_PUBLIC_API_URL`
5. Test the connection from your frontend

## Quick Links

- Railway: https://railway.app
- Render: https://render.com
- Fly.io: https://fly.io
- Heroku: https://heroku.com
