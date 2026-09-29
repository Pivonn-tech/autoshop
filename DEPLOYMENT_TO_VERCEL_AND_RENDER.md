# Complete Deployment: Migrate DB to Render + Deploy Frontend to Vercel

This guide walks you through:
1. **Backing up your local database**
2. **Migrating data to Render PostgreSQL**
3. **Deploying frontend to Vercel**
4. **Testing the complete integration**

---

## Prerequisites

You should have:
- ✅ Backend running on Render
- ✅ PostgreSQL database on Render
- ✅ GitHub repository connected (for Vercel)
- ✅ Vercel account (free tier OK)

---

## STEP 1: Get Your Render Connection Details

**You need to gather these from Render dashboard:**

### 1a. Get Backend URL
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **Web Service** (backend)
3. Look for the URL at the top (e.g., `https://autoshop-backend-xxxxx.onrender.com`)
4. **Save this URL** - you'll need it

### 1b. Get PostgreSQL External Connection String
1. Go to Render Dashboard
2. Click on your **PostgreSQL** service
3. Click **Info** tab
4. Copy the **"External Database URL"** (NOT Internal)
   - Format: `postgresql://user:password@hostname:5432/database`
5. **Save this URL** - you'll use it to migrate data

### 1c. Verify Backend Environment Variables
1. Still in your **Web Service** → **Environment** tab
2. Verify these variables exist:
   - `DATABASE_URL` = (your Render PostgreSQL Internal URL)
   - `NODE_ENV` = production
   - `CORS_ORIGIN` = (placeholder for now, will update after Vercel deployment)
   - `JWT_SECRET` = (should be set)

If `CORS_ORIGIN` shows a placeholder like `https://your-render-backend-url/api`, update it later after you deploy frontend.

---

## STEP 2: Backup Your Local Database

Your local database is in Docker. First, make sure it's running:

```bash
cd /home/phil/projects/autoshop

# Start the database if not running
docker-compose up -d postgres

# Wait a few seconds for it to be ready
sleep 3

# Create a backup
pg_dump postgresql://autoshop:autoshop_password@localhost:5432/autoshop_db > autoshop_backup.sql
```

**Verify the backup was created:**
```bash
ls -lh autoshop_backup.sql
# Should show a file size > 0
```

---

## STEP 3: Restore Database to Render

Now you'll restore your local backup to Render's PostgreSQL.

**IMPORTANT**: Use the **External Database URL** from Step 1b.

```bash
# Replace with your actual Render External Database URL
RENDER_DB_URL="postgresql://user:password@hostname:5432/database"

# Restore the backup
psql "$RENDER_DB_URL" < autoshop_backup.sql
```

**Verify the restore:**
```bash
# Check if tables exist in Render database
psql "$RENDER_DB_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
```

You should see tables like: `Account`, `Appointment`, `Cart`, `CartItem`, `User`, etc.

**Check if your data was transferred:**
```bash
# Should return your cart records (if any exist locally)
psql "$RENDER_DB_URL" -c "SELECT COUNT(*) FROM \"Cart\";"
```

---

## STEP 4: Test Backend Connection to New Database

Test that your Render backend can reach the migrated database:

```bash
# Replace with your backend URL from Step 1a
curl https://autoshop-backend-xxxxx.onrender.com/health
```

You should get:
```json
{
  "status": "OK",
  "uptime": 123.45
}
```

Or test the cart endpoint:
```bash
curl https://autoshop-backend-xxxxx.onrender.com/api/cart
```

Should return JSON (cart records or empty array).

---

## STEP 5: Configure Frontend for Vercel

Update your frontend environment variables:

**File: `/frontend/.env`**

```bash
# Database (only used locally, will use backend API in production)
DATABASE_URL="postgresql://autoshop:autoshop_password@localhost:5432/autoshop_db"

# NextAuth
NEXTAUTH_URL="https://autofixkenya.co.ke"
NEXTAUTH_SECRET="59vkebXTZW7FhKq5Yw/QjpSFW5gMaOiMb/616nen5wI="

# OAuth Providers (Optional - add if using Google/GitHub)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# API - IMPORTANT: Update this to your Render backend URL
NEXT_PUBLIC_API_URL="https://autoshop-backend-xxxxx.onrender.com/api"

# Public site URL
NEXT_PUBLIC_SITE_URL=https://autofixkenya.co.ke
NEXT_PUBLIC_CDN_URL=
```

**Replace `autoshop-backend-xxxxx.onrender.com` with your actual Render URL from Step 1a.**

---

## STEP 6: Push Changes to GitHub

```bash
cd /home/phil/projects/autoshop

# Stage only the .env files (not .next/ build artifacts)
git add frontend/.env backend/.env

# Commit
git commit -m "Update environment variables for Render + Vercel deployment"

# Push to GitHub
git push origin main
```

---

## STEP 7: Deploy Frontend to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if you don't have it
npm install -g vercel

# From frontend directory
cd /home/phil/projects/autoshop/frontend

# Deploy
vercel --prod
```

Vercel will ask questions - use these answers:
- **"Set up and deploy?"** → `Y`
- **"Which scope?"** → Your personal account
- **"Link to existing project?"** → `N` (or `Y` if you already have one)
- **"Project name?"** → `autoshop`
- **"Directory?"** → `./`
- **"Override settings?"** → `N`

After deployment, Vercel shows you the URL (e.g., `https://autoshop-xxxxx.vercel.app`).

### Option B: Using GitHub (Automatic)

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **Add New** → **Project**
3. Import from Git → Select your `autoshop` GitHub repo
4. Configure:
   - **Root Directory** → `frontend`
   - **Framework Preset** → Next.js
   - **Build Command** → `npm run build`
   - **Output Directory** → `.next`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL = https://autoshop-backend-xxxxx.onrender.com/api
   NEXTAUTH_URL = https://autoshop-xxxxx.vercel.app
   NEXTAUTH_SECRET = 59vkebXTZW7FhKq5Yw/QjpSFW5gMaOiMb/616nen5wI=
   ```

6. Click **Deploy**

Vercel will build and deploy automatically. Takes ~2-3 minutes.

---

## STEP 8: Update Render CORS for Vercel

Now that you have your Vercel URL, update the backend's CORS setting:

1. Go to Render Dashboard → **Web Service** → **Environment**
2. Find `CORS_ORIGIN` variable
3. Update it to your Vercel URL:
   ```
   CORS_ORIGIN = https://autoshop-xxxxx.vercel.app
   ```
4. Click **Save**

Render will automatically redeploy with the new setting.

---

## STEP 9: Verify Everything Works

### Test 1: Frontend Loads
```bash
# Open in browser
https://autoshop-xxxxx.vercel.app
```

You should see your AutoShop homepage without errors.

### Test 2: Frontend Can Reach Backend
Open browser console (F12) and check for CORS errors. If you see CORS errors:
- Verify `CORS_ORIGIN` in Render matches your Vercel URL exactly
- Wait 2-3 minutes for Render to redeploy
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)

### Test 3: Test an API Call
In browser console:
```javascript
fetch('https://autoshop-backend-xxxxx.onrender.com/api/cart')
  .then(r => r.json())
  .then(data => console.log(data))
```

Should return cart data (empty array if no carts exist).

### Test 4: Check Database Connection
In browser, navigate to a page that queries the database (e.g., browse car listings, check cart).

If it works, data is flowing: Frontend → Vercel → Render Backend → Render PostgreSQL ✅

---

## STEP 10: Set Up Custom Domain (Optional)

If you want `autofixkenya.co.ke` to point to Vercel:

1. **Vercel Side:**
   - Vercel Dashboard → Project → Settings → Domains
   - Add domain: `autofixkenya.co.ke`
   - Vercel shows you DNS records to add

2. **DNS Provider Side:**
   - Go to your domain registrar (e.g., Namecheap, GoDaddy)
   - Update DNS records to point to Vercel

3. **Update Environment Variables:**
   ```
   NEXTAUTH_URL = https://autofixkenya.co.ke
   NEXT_PUBLIC_SITE_URL = https://autofixkenya.co.ke
   ```

---

## Troubleshooting

### "Backend not responding" or CORS errors
**Problem**: Frontend can't reach backend

**Solution**:
1. Verify `CORS_ORIGIN` in Render matches your Vercel URL exactly
2. Wait 2-3 minutes after saving for Render to redeploy
3. Check Render backend logs for errors:
   - Render Dashboard → Web Service → Logs tab
   - Look for errors like "CORS", "connection refused", or "database error"

### "Database connection failed" in backend logs
**Problem**: Render backend can't connect to PostgreSQL

**Solution**:
1. Verify `DATABASE_URL` is set in Render Environment Variables
2. Check if PostgreSQL service is still running (Render Dashboard)
3. Verify the URL format is correct (should be Internal URL, not External)
4. If needed, check Render PostgreSQL logs for errors

### "Vercel build fails"
**Problem**: Deployment to Vercel fails

**Solution**:
1. Check Vercel build logs (Vercel Dashboard → Project → Deployments → click failed build)
2. Common issues:
   - Missing environment variables → Add them in Vercel Settings → Environment Variables
   - TypeScript errors → Fix type errors in your code
   - Missing dependencies → `npm install` and commit

### "Frontend loads but blank page"
**Problem**: No errors in console, but page is blank

**Solution**:
1. Check browser console for errors (F12)
2. Check Vercel deployment logs (not Vercel build logs - these are runtime errors)
3. Try hard refresh (Ctrl+Shift+R)
4. Check if API calls are working (see Test 3 above)

---

## Quick Reference

### Important URLs (After deployment)

```
Backend API:        https://autoshop-backend-xxxxx.onrender.com
Database (External): postgresql://user:pass@hostname:5432/autoshop
Frontend:           https://autoshop-xxxxx.vercel.app
Domain (custom):    https://autofixkenya.co.ke
```

### Important Commands

```bash
# Backup local database
pg_dump postgresql://autoshop:autoshop_password@localhost:5432/autoshop_db > autoshop_backup.sql

# Restore to Render
psql <RENDER_EXTERNAL_DB_URL> < autoshop_backup.sql

# Test backend
curl https://autoshop-backend-xxxxx.onrender.com/health

# Deploy to Vercel
cd frontend && vercel --prod

# Check Render logs
# Render Dashboard → Web Service → Logs tab
```

### Environment Variables

**Render Backend**:
- `DATABASE_URL` = postgresql://... (Internal URL)
- `NODE_ENV` = production
- `CORS_ORIGIN` = https://autoshop-xxxxx.vercel.app
- `JWT_SECRET` = (your secret)
- `PORT` = 3001

**Vercel Frontend**:
- `NEXT_PUBLIC_API_URL` = https://autoshop-backend-xxxxx.onrender.com/api
- `NEXTAUTH_URL` = https://autoshop-xxxxx.vercel.app
- `NEXTAUTH_SECRET` = (your secret)

---

## Need Help?

- **Render Docs**: https://docs.render.com
- **Vercel Docs**: https://vercel.com/docs
- **NextAuth.js Docs**: https://next-auth.js.org
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

## Checklist

- [ ] Got Render Backend URL
- [ ] Got Render PostgreSQL External URL
- [ ] Created local database backup
- [ ] Restored backup to Render
- [ ] Verified data in Render database
- [ ] Updated frontend `.env` with Backend URL
- [ ] Pushed changes to GitHub
- [ ] Deployed frontend to Vercel
- [ ] Got Vercel URL
- [ ] Updated Render `CORS_ORIGIN`
- [ ] Verified frontend loads without CORS errors
- [ ] Tested API calls from frontend
- [ ] Tested end-to-end flow (cart, checkout, etc.)

