# Quick Reference Card

Keep this open while deploying. Copy-paste ready commands and URLs.

---

## 🎯 Your Mission

- [ ] Deploy backend + database on **Render** → `https://autoshop-backend-xxxxx.onrender.com`
- [ ] Deploy frontend on **Vercel** → `https://autoshop-xxxxx.vercel.app`
- [ ] Connect them together ✅

**Status**: Paused at Render Web Service creation

---

## 📍 RESUME NOW: Render Setup

### Complete Web Service (in Render dashboard):

```
Root Directory:  backend
Environment:     Node
Build Command:   npm install
Start Command:   node src/index.js
Plan:            Free
                 ↓ Click "Create Web Service"
```

### Create PostgreSQL:

```
Click "New +" → "PostgreSQL"
Name:           autoshop-db
Database:       autoshop
User:           autoshop
Region:         [same as web service]
Plan:           Free
                ↓ Click "Create Database"
```

### Get Credentials:

Go to PostgreSQL service → Info tab → Copy both:
- **Internal URL**: `postgresql://autoshop:pw@postgres.render.internal:5432/autoshop`
- **External URL**: `postgresql://autoshop:pw@ec2-xx-xx-xx-xx.compute.amazonaws.com:5432/autoshop`

### Set Environment Variables:

Go to Web Service → Environment tab → Add:

```
DATABASE_URL      = [use INTERNAL URL from above]
NODE_ENV          = production
CORS_ORIGIN       = https://placeholder.vercel.app
JWT_SECRET        = [random secure key - min 32 chars]
PORT              = 3001
```

Click Save → Auto-redeploys

---

## 💾 Migrate Your Data

### On your laptop:

```bash
# 1. Backup local database
pg_dump postgresql://phil:phil@localhost:5432/autoshop_db > autoshop_backup.sql

# 2. Restore to Render
# Replace with YOUR external database URL from above
psql postgresql://autoshop:password@ec2-xx.compute.amazonaws.com:5432/autoshop < autoshop_backup.sql
```

**Wait for completion** (~1-2 minutes)

---

## ✅ Verify Render Backend

### In Render dashboard → Web Service → Logs:
```
✅ Looking for: "Database connection OK"
✅ Looking for: "AutoShop API started"
```

### Test health endpoint:
```bash
curl https://autoshop-backend-xxxxx.onrender.com/health
```

Should return:
```json
{"status": "OK", "uptime": 123.45}
```

### Test API with data:
```bash
curl https://autoshop-backend-xxxxx.onrender.com/api/cart
```

Should show your ~51 carts

---

## 🚀 Next: Deploy Frontend to Vercel

### Go to https://vercel.com

```
1. Sign up with GitHub
2. Click "Add New" → "Project"
3. Select your GitHub repo
4. Framework: Next.js (auto-detected ✓)
```

### Build settings:

```
Build Command:     cd frontend && npm run build
Output Directory:  frontend/.next
Install Command:   npm run setup
```

### Environment variables:

```
NEXT_PUBLIC_API_URL = https://autoshop-backend-xxxxx.onrender.com/api
(Replace xxxxx with your actual Render backend name)
```

### Deploy:

```
Click "Deploy" → Wait 3-5 minutes → Done ✅
Note your URL: https://autoshop-xxxxx.vercel.app
```

---

## 🔗 Final: Update Backend CORS

### Go to Render Web Service → Environment:

Update:
```
CORS_ORIGIN = https://autoshop-xxxxx.vercel.app
(Replace with your actual Vercel URL from above)
```

Save → Auto-redeploys

---

## 🧪 Test Full Integration

### Visit: `https://autoshop-xxxxx.vercel.app`

```
✅ Page loads without 404
✅ Images visible
✅ No red errors in DevTools (F12 → Console)
✅ Try adding product to cart
✅ Check Network tab → API request goes to Render backend
✅ API response shows 200 status
```

---

## 📋 Commands Cheat Sheet

```bash
# Backup database
pg_dump postgresql://phil:phil@localhost:5432/autoshop_db > backup.sql

# Restore database
psql <external-db-url> < backup.sql

# Test backend
curl https://autoshop-backend-xxxxx.onrender.com/health

# View backend logs
# Render → Web Service → Logs tab

# View frontend build logs
# Vercel → Deployments → Click deployment
```

---

## 🔑 Key URLs You'll Get

After deployment, save these:

```
Backend API:     https://autoshop-backend-xxxxx.onrender.com
Frontend:        https://autoshop-xxxxx.vercel.app
Database (copy): postgresql://autoshop:...@hostname:5432/autoshop
```

---

## ⚠️ Common Mistakes

❌ Using External DB URL in web service (use Internal instead)
❌ Forgetting to migrate data
❌ Not updating CORS_ORIGIN with Vercel URL
❌ Typos in environment variables
❌ Restarting services while still configuring

---

## ✅ Success Checklist

- [ ] Render Web Service created
- [ ] PostgreSQL database created
- [ ] Environment variables set
- [ ] Data migrated to Render
- [ ] Backend health check passes
- [ ] Vercel account created
- [ ] Frontend deployed
- [ ] CORS_ORIGIN updated
- [ ] Full integration test passes

---

## 📚 Full Guides (if you get stuck)

- `RENDER_QUICK_START.md` - Visual step-by-step
- `STEP_BY_STEP_VERCEL.md` - Frontend deployment
- `COMPLETE_DEPLOYMENT_PATH.md` - Full reference

---

## ⏱️ Timeline

```
Now              Start (you are here)
+15 min          Backend + DB ready ✅
+25 min          Frontend deployed ✅
+30 min          🎉 FULLY ONLINE
```

---

**Ready? Open `RENDER_QUICK_START.md` and follow along.**
