# AutoShop on Vercel - Quick Reference

Your AutoShop app is ready to deploy to Vercel! Here's what you need to know.

## 📋 Quick Start

**Follow these in order:**

1. **Deploy Backend** (5-10 min) → `BACKEND_DEPLOYMENT.md`
   - Choose Railway, Render, or Fly.io
   - Get your backend URL
   - Run database migrations

2. **Deploy Frontend** (5 min) → `STEP_BY_STEP_VERCEL.md`
   - Create Vercel account
   - Import your GitHub repo
   - Add backend URL as environment variable
   - Click Deploy

3. **Done!** Your site is live 🎉

---

## 📚 Complete Guides

- **`STEP_BY_STEP_VERCEL.md`** ← Start here if you want to deploy immediately
- **`BACKEND_DEPLOYMENT.md`** ← Deploy the Express backend
- **`VERCEL_DEPLOYMENT_GUIDE.md`** ← Detailed architecture & setup
- **`VERCEL_SETUP_CHECKLIST.md`** ← Complete checklist for all steps

---

## 🏗️ Architecture

Your app has two parts:

```
┌─────────────────────────────────┐
│  Frontend (Next.js)             │
│  Hosted on: Vercel              │
│  URL: https://autoshop.com      │
└──────────────┬──────────────────┘
               │
        (API calls via HTTPS)
               │
┌──────────────▼──────────────────┐
│  Backend (Express)              │
│  Hosted on: Railway/Render/etc  │
│  URL: https://api.autoshop.com  │
├─────────────────────────────────┤
│  PostgreSQL Database            │
└─────────────────────────────────┘
```

---

## 🚀 Deployment Steps Summary

### 1. Backend Setup (Choose one platform)

**Railway** (recommended):
```bash
1. Go to railway.app → Sign up with GitHub
2. Create project → Add PostgreSQL
3. Add Node.js service (your repo, root: backend)
4. Set environment variables
5. Railway auto-deploys → get backend URL
```

**Render** (alternative):
```bash
1. Go to render.com → Sign up
2. Create Web Service (your repo, root: backend)
3. Create PostgreSQL database
4. Set environment variables
5. Deploy → get backend URL
```

### 2. Frontend Setup

```bash
1. Go to vercel.com → Sign up with GitHub
2. Import your repository
3. Set build command: cd frontend && npm run build
4. Add environment variable: NEXT_PUBLIC_API_URL=<your-backend-url>/api
5. Click Deploy → done!
```

### 3. Update Backend CORS

```bash
1. Backend platform dashboard
2. Update: CORS_ORIGIN=https://your-vercel-domain.vercel.app
3. Restart service
```

---

## 🔗 Environment Variables

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### Backend (Railway/Render)
```
NODE_ENV=production
DATABASE_URL=<auto-provided>
CORS_ORIGIN=https://your-domain.vercel.app
JWT_SECRET=<your-secure-key>
```

---

## ✅ Verification Checklist

After deployment:

- [ ] Frontend loads at https://your-domain.vercel.app
- [ ] No 404 or CORS errors in browser console (F12)
- [ ] Products list loads
- [ ] Cart functionality works
- [ ] API requests show 200 status in Network tab
- [ ] Images load correctly
- [ ] Backend logs show successful requests

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| "Cannot reach backend" | Check CORS_ORIGIN and NEXT_PUBLIC_API_URL |
| CORS errors | Update backend CORS_ORIGIN to Vercel domain |
| Build fails | Run `npm run setup` locally to verify |
| Images broken | Check backend /uploads path |
| 502 errors | Backend service crashed, check logs |

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed troubleshooting.

---

## 💰 Costs

- **Vercel Frontend**: Free tier available
- **Railway Backend**: $5/month minimum
- **Total**: ~$5-15/month for hobby project

---

## 🔄 Automatic Deployments

After first deploy, Vercel auto-deploys on every git push:

```bash
git add .
git commit -m "Your changes"
git push origin main
# → Vercel automatically builds and deploys in ~2 minutes
```

---

## 📖 Next Steps

1. Read `STEP_BY_STEP_VERCEL.md` for immediate deployment
2. Choose a backend platform (Railway recommended)
3. Deploy backend first
4. Deploy frontend to Vercel
5. Test and celebrate! 🎉

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com

---

**Last Updated**: 2024
**Project**: AutoShop
**Framework**: Next.js + Express
**Deployment**: Vercel + Railway/Render
