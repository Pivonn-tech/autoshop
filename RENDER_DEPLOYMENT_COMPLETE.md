# Render Deployment - Complete Guide (In Progress)

You've started creating a Render Web Service. This guide will walk you through completing it, including getting your PostgreSQL database online with your local data.

## ✅ What You Have

Your local database contains:
- **Users**: 0
- **Appointments**: 0
- **Car Listings**: 0
- **Orders**: 0
- **Carts**: 51 records (minor data)
- **Other tables**: Empty

So minimal data to migrate - mostly schema only.

## Current Status

You're at: **Render → New Web Service** (paused)

Let's continue from there.

---

## Part 1: Complete Render Setup (5 minutes)

### Step 1: Finish Creating the Web Service

You're in Render's "New Web Service" dialog. Continue with:

1. **Repository**
   - Already selected: your GitHub repo ✓

2. **Root Directory**
   - Set to: `backend`
   - This tells Render to run your Express server

3. **Environment** (scroll down)
   - Select: **Node**
   - Build Command: `npm install`
   - Start Command: `node src/index.js`

4. **Plan** (scroll down)
   - Choose: **Free** (limited) or **Starter** ($7/month)
   - Free tier works for testing
   - Paid tier recommended for production

5. **Advance to Environment**
   - Don't worry about environment variables yet - we'll add them next

6. **Click "Create Web Service"**

Render will start building. This takes ~3-5 minutes first time.

### Step 2: Create PostgreSQL Database

While the web service builds, create the database:

1. Go back to Render dashboard
2. Click **"New +"** button → **"PostgreSQL"**
3. Configure:
   - **Name**: `autoshop-db` (or similar)
   - **Database**: `autoshop` (or `autoshop_db`)
   - **User**: `autoshop` (or any username)
   - **Region**: Same as your web service (for speed)
   - **Plan**: Free tier or Starter

4. Click **"Create Database"**

Render will provision PostgreSQL (takes ~2 minutes).

### Step 3: Get Database Connection String

After PostgreSQL is created:

1. Go to your PostgreSQL service in Render
2. Click **"Info"** tab
3. Copy the **Internal Database URL** (for internal connections from your web service):
   ```
   postgresql://user:password@hostname:5432/database
   ```

Keep this handy - you'll need it in a minute.

---

## Part 2: Connect Services & Migrate Data (10 minutes)

### Step 4: Set Web Service Environment Variables

1. Go back to your **Web Service** in Render
2. Click **"Environment"** tab
3. Add these variables:

```
DATABASE_URL = postgresql://user:password@hostname:5432/database
NODE_ENV = production
CORS_ORIGIN = https://yourdomain.vercel.app
JWT_SECRET = your-secure-random-key-here
PORT = 3001
```

**Where to get DATABASE_URL:**
- From your PostgreSQL service → Info tab → Internal Database URL

**For CORS_ORIGIN:**
- Leave as placeholder for now: `https://placeholder.vercel.app`
- Update later when you deploy frontend to Vercel

4. Click **"Save"** (triggers redeploy)

### Step 5: Get External Database URL (for local migration)

To migrate your local data, you need the **External Database URL**:

1. Go to PostgreSQL service → Info tab
2. Find **"External Database URL"** (different from Internal)
3. Copy it (format: `postgresql://user:password@external-hostname:5432/database`)

This is what you'll use from your laptop to push data.

---

## Part 3: Migrate Your Local Data (10 minutes)

You have two options:

### Option A: Using pg_dump (Recommended - Easiest)

This dumps your entire local database and restores it to Render's database.

#### Step 1: Create a backup of your local database

```bash
# From your laptop terminal:
pg_dump postgresql://phil:phil@localhost:5432/autoshop_db > autoshop_backup.sql
```

This creates a file `autoshop_backup.sql` with all your database data.

#### Step 2: Get the External Database URL from Render

From Render PostgreSQL service → Info tab, copy:
```
postgresql://autoshop:PASSWORD@ec2-12-34-56-78.compute-1.amazonaws.com:5432/autoshop
```

#### Step 3: Restore to Render's database

```bash
# Replace with your actual Render DATABASE_URL
psql postgresql://autoshop:PASSWORD@ec2-12-34-56-78.compute-1.amazonaws.com:5432/autoshop < autoshop_backup.sql
```

Wait for it to complete (~1-2 minutes).

#### Step 4: Verify the migration

```bash
# Check if tables exist in Render's database
psql postgresql://autoshop:PASSWORD@ec2-12-34-56-78.compute-1.amazonaws.com:5432/autoshop \
  -c "SELECT * FROM \"Cart\" LIMIT 5;"
```

Should see your 51 cart records!

---

### Option B: Using Prisma Migrations (Alternative)

If pg_dump fails:

```bash
# In your backend directory
cd backend

# Set the Render DATABASE_URL
export DATABASE_URL="postgresql://autoshop:PASSWORD@external-hostname:5432/autoshop"

# Run Prisma migrations (creates all tables)
npm run migrate

# Optional: Seed data if you have a seed script
npm run seed
```

This ensures schema is correct but won't transfer your 51 cart records.

**Use Option A if possible** - it's faster and preserves all data.

---

## Part 4: Verify Everything Works (5 minutes)

### Step 1: Check Web Service Status

1. Go to Render dashboard → Your Web Service
2. Check **"Logs"** tab
3. Should see:
   ```
   AutoShop API started on port 3001
   Database connection OK
   ```

If you see errors, check the error messages in logs.

### Step 2: Test the API Health

In your browser or terminal:

```bash
# Get your Render web service URL (displayed in Render dashboard)
# Format: https://autoshop-backend-xxxxx.onrender.com

curl https://autoshop-backend-xxxxx.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "uptime": 123.45
}
```

### Step 3: Test Database Connection

```bash
# This tests if your API can talk to the database
curl https://autoshop-backend-xxxxx.onrender.com/api/cart
```

Should return JSON with your carts (or `[]` if empty).

If you see errors:
- Check logs in Render dashboard
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

---

## Part 5: Update for Vercel Frontend (2 minutes)

When you deploy to Vercel, you'll need:

### In Vercel Environment Variables:
```
NEXT_PUBLIC_API_URL = https://autoshop-backend-xxxxx.onrender.com/api
```

### In Render Backend Environment Variables:
Update when you have your Vercel URL:
```
CORS_ORIGIN = https://autoshop-xxxxx.vercel.app
```

Then Render will automatically redeploy.

---

## Troubleshooting

### "Database connection failed"

**Problem**: Backend can't connect to PostgreSQL

**Solutions**:
1. Verify DATABASE_URL is correct in Render environment
2. Check PostgreSQL service is running (Render dashboard)
3. Ensure you used **Internal Database URL** (not External) in web service
4. Check if PostgreSQL still initializing (takes a few minutes)

**Test locally**:
```bash
psql postgresql://user:password@hostname:5432/database -c "SELECT 1"
```

### "Migration failed"

**Problem**: `npm run migrate` failed

**Solutions**:
1. Check if DATABASE_URL is set correctly
2. Ensure PostgreSQL is accepting connections
3. Try Option A (pg_dump) instead - it might be simpler

### "CORS error" when frontend calls API

**Problem**: Browser shows CORS blocked error

**Solutions**:
1. Update CORS_ORIGIN in Render to match your Vercel URL
2. Restart Render web service
3. Hard refresh frontend (Ctrl+F5)

### "pg_dump: command not found"

**Problem**: Your laptop doesn't have PostgreSQL client tools

**Solutions**:
1. Install PostgreSQL:
   ```bash
   # macOS
   brew install postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql-client
   
   # Windows - download PostgreSQL installer
   ```
2. Or use Option B (Prisma migrations)

### "Port 3001 already in use"

**Problem**: Backend won't start

**Solution**: Render automatically handles this - not an issue.

---

## What You Have Now

After following this guide:

✅ **Backend**: Running on Render (e.g., `autoshop-backend-xxxxx.onrender.com`)
✅ **PostgreSQL**: Running on Render with your data migrated
✅ **Environment**: All variables configured
✅ **Health Check**: API responding to requests
✅ **Data**: Your 51 cart records transferred to production

---

## Next: Deploy Frontend to Vercel

Once your backend is working:

1. Update `NEXT_PUBLIC_API_URL` in Vercel to your Render URL
2. Deploy frontend
3. Test full integration

See `STEP_BY_STEP_VERCEL.md` for frontend deployment.

---

## Quick Reference

### Important URLs (After deployment)

```
Backend API: https://autoshop-backend-xxxxx.onrender.com
Database (External): postgresql://user:pass@hostname:5432/autoshop
Frontend: https://autoshop-xxxxx.vercel.app (later)
```

### Important Commands

```bash
# Dump local database
pg_dump postgresql://phil:phil@localhost:5432/autoshop_db > autoshop_backup.sql

# Restore to Render
psql <external-database-url> < autoshop_backup.sql

# Test backend health
curl https://autoshop-backend-xxxxx.onrender.com/health

# View Render logs
# Dashboard → Web Service → Logs tab
```

### Environment Variables Needed

**Render Web Service**:
- DATABASE_URL (from PostgreSQL service)
- NODE_ENV (set to "production")
- CORS_ORIGIN (your Vercel frontend URL)
- JWT_SECRET (random secure key)

**Vercel Frontend** (later):
- NEXT_PUBLIC_API_URL (your Render backend URL)

---

## Support

- Render Docs: https://docs.render.com
- PostgreSQL: https://www.postgresql.org/docs
- Prisma: https://www.prisma.io/docs
