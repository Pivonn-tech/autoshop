# Vercel Deployment Guide

This guide explains how to deploy your AutoShop application to Vercel.

## Architecture

Your app has two parts:
- **Frontend**: Next.js application (can be hosted on Vercel)
- **Backend**: Express API server (needs separate hosting)

### Deployment Strategy

We recommend deploying:
1. **Frontend** → Vercel (free tier available)
2. **Backend** → Railway, Render, Fly.io, or similar (PostgreSQL + Node.js)

## Step 1: Deploy Backend First

Your backend needs:
- A PostgreSQL database
- A Node.js runtime environment
- Environment variables configured

### Recommended Platforms:
- **Railway** (easiest, $5/month minimum): https://railway.app
- **Render** (free tier available): https://render.com
- **Fly.io** (free tier): https://fly.io
- **Heroku** (paid, $7+/month): https://heroku.com

#### Example: Deploy to Railway

1. Go to https://railway.app and sign up
2. Create a new project
3. Add PostgreSQL database plugin
4. Add a Node.js service and connect your GitHub repo
5. Set environment variables in Railway dashboard:
   ```
   NODE_ENV=production
   DATABASE_URL=<provided by Railway>
   CORS_ORIGIN=https://yourdomain.vercel.app
   JWT_SECRET=<strong-random-key>
   PORT=3001
   ```

After deployment, note your backend URL (e.g., `https://autoshop-api.railway.app`)

## Step 2: Configure Frontend Environment

Update `frontend/.env.production` with your backend URL:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url/api
```

## Step 3: Deploy Frontend to Vercel

### Prerequisites:
- GitHub account with your repo pushed
- Vercel account (free signup at https://vercel.com)

### Steps:

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Setup for Vercel deployment"
   git push origin main
   ```

2. Go to https://vercel.com/import
3. Import your GitHub repository
4. Select "Next.js" as the framework
5. In "Build & Development Settings":
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/.next`
   - Install Command: `npm run setup`

6. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   ```

7. Click Deploy

### Production Environment Variables

For different environments, use Vercel's environment override feature:

```
NEXT_PUBLIC_API_URL (Production): https://your-railway-backend.railway.app/api
NEXT_PUBLIC_API_URL (Preview): https://your-dev-backend.railway.app/api
NEXT_PUBLIC_API_URL (Development): http://localhost:3001/api
```

## Step 4: Update CORS Configuration

Update your backend to accept requests from Vercel:

In `backend/src/index.js`, the CORS is already configured to use `CORS_ORIGIN` env var:

```javascript
cors({
  origin: process.env.CORS_ORIGIN || (IS_PROD ? false : "*"),
  credentials: true,
})
```

Ensure you set `CORS_ORIGIN=https://yourdomain.vercel.app` in your backend hosting platform.

## Step 5: Configure Database Connection

### For Railway/Render:
- They provide a `DATABASE_URL` connection string
- This is automatically picked up by Prisma

### Update Prisma:
Ensure `backend/prisma/schema.prisma` uses the connection string:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Run migrations on first deployment:
```bash
# In your backend deployment platform, run:
npm run migrate
```

## Step 6: Test Your Deployment

1. Visit your Vercel domain (e.g., https://autoshop.vercel.app)
2. Check browser console for API errors
3. Test cart functionality
4. Verify backend connectivity

## Environment Variables Reference

### Backend (Railway/Render)
```
DATABASE_URL=postgresql://user:pass@host/db
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.vercel.app
JWT_SECRET=<generate-strong-random-key>
PORT=3001

# Optional services
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=...

SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-url/api
```

## Troubleshooting

### "Cannot reach backend" / CORS errors
- Check backend URL is correct in `NEXT_PUBLIC_API_URL`
- Verify `CORS_ORIGIN` is set to your Vercel domain
- Check backend logs for connection issues

### Database connection errors
- Verify `DATABASE_URL` is set correctly
- Run migrations: `npm run migrate`
- Check PostgreSQL is accepting connections

### Images not loading
- Verify backend is serving `/uploads` and `/images` correctly
- Check CORS allows image requests
- Update `next.config.js` remotePatterns if needed

### Build failures on Vercel
- Check build logs in Vercel dashboard
- Ensure `npm run setup` completes successfully
- Verify all dependencies are properly listed

## Custom Domain

Once everything is working:
1. Go to Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

## Automatic Deployments

Vercel will automatically redeploy when you push to the `main` branch (configurable).

## Cost Breakdown

- **Vercel Frontend**: Free tier available, $20+/month for Pro
- **Railway Backend**: $5/month minimum + usage costs
- **Database**: Included in Railway/Render pricing
- **Total**: ~$5-15/month for hobby project

## Next Steps

1. Choose a backend hosting platform
2. Deploy backend with PostgreSQL database
3. Note the backend URL
4. Update environment variables
5. Deploy frontend to Vercel
6. Test thoroughly

Questions? Check the specific platform's documentation or Vercel's docs at https://vercel.com/docs
