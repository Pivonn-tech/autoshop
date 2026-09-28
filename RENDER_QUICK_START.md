# Render Deployment - Quick Start (Resume Here)

You paused at: **Render → New Web Service**

This guide gets you from there to a working backend with your database online. **~15 minutes total**.

---

## Where You Were

```
✅ Created account
✅ Started Web Service creation
⏸️  PAUSED HERE ← You are here
⬜ Create PostgreSQL
⬜ Migrate data
⬜ Configure environment
⬜ Verify
```

---

## Resume: Complete Web Service Creation (3 min)

### In Render Dashboard → New Web Service dialog:

```
┌─────────────────────────────────────┐
│ REPOSITORY                          │
│ [your-github-repo] ✓                │
├─────────────────────────────────────┤
│ ROOT DIRECTORY: backend ← SET THIS  │
│ ENVIRONMENT: Node ← SELECT THIS     │
├─────────────────────────────────────┤
│ BUILD COMMAND:                      │
│ npm install                         │
├─────────────────────────────────────┤
│ START COMMAND:                      │
│ node src/index.js                   │
├─────────────────────────────────────┤
│ PLAN: Free (or Starter $7)          │
├─────────────────────────────────────┤
│ [CREATE WEB SERVICE] ← CLICK THIS   │
└─────────────────────────────────────┘
```

**Click "Create Web Service"** → Render starts building (takes ~3-5 min)

---

## While Building: Create PostgreSQL (2 min)

### In Render Dashboard:

1. Click **"New +"**
2. Select **"PostgreSQL"**

```
┌─────────────────────────────────────┐
│ NAME: autoshop-db                   │
│ DATABASE: autoshop                  │
│ USER: autoshop                      │
│ REGION: [same as web service]       │
│ PLAN: Free (or Starter)             │
│                                     │
│ [CREATE DATABASE] ← CLICK           │
└─────────────────────────────────────┘
```

**Click "Create Database"** → Render provisions (takes ~2 min)

---

## Get Credentials (1 min)

### After both are created:

1. **Go to PostgreSQL service** → click it
2. Click **"Info"** tab
3. Copy:
   - **Internal Database URL** (for web service) - save this
   - **External Database URL** (for your laptop) - save this too

Example:
```
Internal: postgresql://autoshop:pw123@postgres.render.internal:5432/autoshop
External: postgresql://autoshop:pw123@ec2-12-34-56-78.compute.amazonaws.com:5432/autoshop
```

---

## Configure Web Service Environment (2 min)

### Go to Web Service → Environment tab:

Add these variables:

```
DATABASE_URL
postgresql://autoshop:pw123@postgres.render.internal:5432/autoshop
↑ Use INTERNAL URL from PostgreSQL Info

NODE_ENV
production

CORS_ORIGIN
https://placeholder.vercel.app
(update later when you have your Vercel URL)

JWT_SECRET
your-super-secret-random-key-here-make-it-long

PORT
3001
```

**Save** → Renders redeploys automatically

---

## Migrate Your Data (5 min)

### On your laptop terminal:

```bash
# 1. Backup your local database
pg_dump postgresql://phil:phil@localhost:5432/autoshop_db > backup.sql

# 2. Restore to Render
# Use your EXTERNAL DATABASE URL from above
psql postgresql://autoshop:pw123@ec2-12-34-56-78.compute.amazonaws.com:5432/autoshop < backup.sql
```

**If pg_dump not found:**
```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql-client
```

Wait for it to complete (~1-2 min).

---

## Verify It Works (2 min)

### Check Web Service Logs

1. Go to Web Service → **Logs** tab
2. Look for:
   ```
   AutoShop API started on port 3001
   Database connection OK
   ```

If you see errors, scroll up to see what went wrong.

### Test the API

Your backend URL is displayed at top of Render Web Service page:
```
https://autoshop-backend-xxxxx.onrender.com
```

Test in browser or terminal:
```bash
curl https://autoshop-backend-xxxxx.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "uptime": 123.45
}
```

### Verify Data Migrated

```bash
curl https://autoshop-backend-xxxxx.onrender.com/api/cart
```

Should show your carts (should have ~51).

---

## ✅ Done with Backend!

You now have:
```
✅ Backend running on Render
✅ PostgreSQL database on Render  
✅ Your data migrated
✅ API responding to requests
✅ Ready for frontend
```

---

## Next: Deploy Frontend to Vercel

See `STEP_BY_STEP_VERCEL.md` with this important change:

**When setting up Vercel environment, use:**
```
NEXT_PUBLIC_API_URL = https://autoshop-backend-xxxxx.onrender.com/api
```

Replace `xxxxx` with your actual Render URL.

---

## Troubleshooting

### Backend won't start
**Check logs** in Render (Logs tab) - see the actual error

Common issues:
- DATABASE_URL typo
- PostgreSQL still initializing
- Port already in use (Render handles this)

### "Cannot connect to database"
- Verify DATABASE_URL in Render is correct
- Check it uses INTERNAL URL (not External)
- Wait a few minutes for PostgreSQL to fully start

### "pg_dump command not found"
- PostgreSQL not installed on your laptop
- Install it (see commands above)

### Data didn't migrate
- Double-check the External URL you used
- Try again: `pg_dump | psql`
- Or use Prisma migrations (see full guide)

---

## Quick Reference

```bash
# On your laptop

# Backup local DB
pg_dump postgresql://phil:phil@localhost:5432/autoshop_db > backup.sql

# Restore to Render
psql <your-external-db-url> < backup.sql

# Test API
curl https://autoshop-backend-xxxxx.onrender.com/health
```

---

## Timeline

```
Now:              ← Complete web service setup
+3-5 min:         Backend building
+5 min:           PostgreSQL ready
+8 min:           Configure environment
+13 min:          Migrate data
+15 min:          ✅ DONE - Backend ready

Next (separate):  Deploy frontend to Vercel (~10 min)
```

---

## Your URLs After Deployment

```
Backend API:      https://autoshop-backend-xxxxx.onrender.com
Database (internal use only)
Frontend (later):  https://autoshop-xxxxx.vercel.app
```

---

**Ready to continue? Follow these steps exactly as shown above.** Questions? Check `RENDER_DEPLOYMENT_COMPLETE.md` for detailed explanations.
