# Vercel Deployment Checklist

Complete these steps in order to deploy your AutoShop app to Vercel.

## Phase 1: Backend Setup (5-10 minutes)

Choose ONE platform and follow its guide:

### Option A: Railway (Recommended ⭐)
- [ ] Go to https://railway.app and sign up
- [ ] Create new project
- [ ] Add PostgreSQL plugin (Railway creates it instantly)
- [ ] Add Node.js service (select your GitHub repo, root: `backend`)
- [ ] Set environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `CORS_ORIGIN=<will-update-later-with-vercel-url>`
  - [ ] `JWT_SECRET=<generate-random-key>`
- [ ] Wait for first deployment (5-10 minutes)
- [ ] Copy backend URL: `https://autoshop-api-XXX.railway.app`
- [ ] Go to Railway shell and run: `npm run migrate`
- [ ] Test backend: `curl https://autoshop-api-XXX.railway.app/health`

### Option B: Render (Alternative)
- [ ] Go to https://render.com and sign up
- [ ] Create Web Service (select repo, root: `backend`)
- [ ] Create PostgreSQL database
- [ ] Set environment variables (same as above)
- [ ] Wait for deployment
- [ ] Run migrations via Render shell
- [ ] Test backend health endpoint

**After either option, you have:**
- ✅ Backend URL: `https://your-backend-url.com`
- ✅ PostgreSQL database running
- ✅ Node.js service deployed

---

## Phase 2: Prepare Frontend for Vercel (2 minutes)

### Update Environment File

1. Open `frontend/.env.production`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   NEXT_PUBLIC_SITE_URL=https://yourdomain.vercel.app
   ```

2. Ensure `vercel.json` exists in project root:
   ```json
   {
     "projectSettings": {
       "framework": "nextjs",
       "buildCommand": "cd frontend && npm run build",
       "outputDirectory": "frontend/.next",
       "installCommand": "npm run setup"
     }
   }
   ```

### Commit and Push Changes

```bash
cd /home/phil/projects/autoshop
git add .
git commit -m "Setup for Vercel deployment"
git push origin main
```

---

## Phase 3: Deploy to Vercel (5 minutes)

1. [ ] Go to https://vercel.com
2. [ ] Click "Import Project"
3. [ ] Select your GitHub repository
4. [ ] Configure project:
   - [ ] Framework: "Next.js"
   - [ ] Root Directory: "frontend" or leave blank (Vercel auto-detects)
   - [ ] Build Command: `cd frontend && npm run build`
   - [ ] Output Directory: `frontend/.next`
   - [ ] Install Command: `npm run setup`

5. [ ] Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url/api
   ```

6. [ ] Click "Deploy"

7. [ ] Wait for build to complete (3-5 minutes)

8. [ ] Check deployment logs for errors

9. [ ] Visit your new URL: `https://autoshop-xxx.vercel.app`

---

## Phase 4: Update Backend CORS (1 minute)

Now that you have your Vercel URL, update backend CORS:

**Your Vercel URL format:** `https://autoshop-xxx.vercel.app`

1. [ ] Go to your backend hosting platform (Railway/Render)
2. [ ] Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://autoshop-xxx.vercel.app
   ```
3. [ ] Restart/redeploy backend service

---

## Phase 5: Testing (5 minutes)

### Test Frontend
- [ ] Visit https://autoshop-xxx.vercel.app
- [ ] Page loads without 404 errors
- [ ] Click around and check console (F12) for errors

### Test API Connectivity
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Try adding an item to cart
- [ ] Verify API request goes to `https://your-backend-url/api`
- [ ] Check response is successful (200 status)

### Test Key Features
- [ ] View products list
- [ ] Add product to cart
- [ ] Check cart updates
- [ ] Try checkout process
- [ ] Test appointment booking (if applicable)

### Check Server Logs
- **Vercel**: Deployment → Logs
- **Railway/Render**: Deployment Logs or Live Logs

---

## Phase 6: Configure Custom Domain (Optional)

If you have a custom domain (e.g., autofixkenya.co.ke):

1. [ ] In Vercel project → Settings → Domains
2. [ ] Add your custom domain
3. [ ] Vercel provides DNS records to add
4. [ ] Update your domain registrar DNS settings
5. [ ] Wait 24-48 hours for DNS propagation
6. [ ] Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars

---

## Phase 7: Monitoring & Maintenance

### Weekly
- [ ] Check Vercel deployment logs for errors
- [ ] Monitor backend service health

### Monthly
- [ ] Review error logs
- [ ] Check database usage
- [ ] Review platform costs

### Environment Variables to Monitor
- Backend: `CORS_ORIGIN`, `DATABASE_URL`, `JWT_SECRET`
- Frontend: `NEXT_PUBLIC_API_URL`

---

## Troubleshooting Quick Links

### "Build failed"
→ Check Vercel build logs
→ Ensure `npm run setup` completes successfully
→ Verify all dependencies are properly listed

### "API returns 404"
→ Verify backend is deployed and running
→ Check `NEXT_PUBLIC_API_URL` matches backend URL
→ Look at Network tab in DevTools

### "CORS error"
→ Verify `CORS_ORIGIN` in backend matches Vercel domain
→ Check backend logs for CORS rejection
→ Restart backend after updating CORS_ORIGIN

### "Cannot connect to database"
→ Verify `DATABASE_URL` is set in backend platform
→ Run migrations: `npm run migrate`
→ Check database service is running

### "Images not loading"
→ Verify backend `/uploads` and `/images` endpoints
→ Check CORS allows image requests
→ Try accessing image directly: `https://backend-url/uploads/...`

---

## Success Criteria

You'll know it's working when:
- ✅ Frontend loads without 404 errors
- ✅ Console (F12) shows no CORS errors
- ✅ API requests show 200 status codes
- ✅ Cart functionality works
- ✅ Product images load
- ✅ Backend logs show successful requests

---

## Quick Command Reference

```bash
# Deploy backend migrations
railway shell
npm run migrate
exit

# Test backend endpoint
curl https://your-backend-url/health

# Check Vercel deployment
# → Go to https://vercel.com and check project

# View backend logs
# Railway: Dashboard → Your service → Deployments
# Render: Dashboard → Your service → Logs
```

---

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Next.js Docs: https://nextjs.org/docs
