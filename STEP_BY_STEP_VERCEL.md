# Step-by-Step: Deploy to Vercel in 15 Minutes

This is the most direct path to get your AutoShop running on Vercel.

## Prerequisites

- Your code pushed to GitHub
- A backend deployed (Railway, Render, etc.) - see `BACKEND_DEPLOYMENT.md`
- Backend URL ready (e.g., `https://autoshop-api-prod.railway.app`)

---

## Step 1: Create Vercel Account (2 minutes)

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account
5. You're logged in!

---

## Step 2: Import Your Project (1 minute)

1. On Vercel dashboard, click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Paste your repo URL or find it in the list:
   ```
   https://github.com/yourusername/autoshop
   ```
4. Click "Import"

---

## Step 3: Configure Build Settings (2 minutes)

Vercel should auto-detect Next.js, but verify:

1. **Framework Preset**: Next.js ✓
2. **Root Directory**: Leave empty (Vercel will auto-detect)
3. **Build and Output Settings** → Edit:
   - **Build Command**:
     ```
     cd frontend && npm run build
     ```
   - **Output Directory**:
     ```
     frontend/.next
     ```
   - **Install Command**:
     ```
     npm run setup
     ```

These settings tell Vercel:
- Where to find your Next.js app (in `frontend/` folder)
- How to build it
- Where the output goes

---

## Step 4: Add Environment Variables (1 minute)

Still in the import dialog:

1. Scroll down to "Environment Variables"
2. Add this variable:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-backend-url/api
   
   Example:
   NEXT_PUBLIC_API_URL=https://autoshop-api-prod.railway.app/api
   ```
3. Click "Add"

That's it! This tells your frontend where to find your backend API.

---

## Step 5: Deploy (1 minute)

1. Scroll to bottom and click **"Deploy"**
2. Vercel starts building your project
3. Watch the build progress:
   - Installing dependencies (~30 seconds)
   - Building (~2-3 minutes)
   - Optimizing (~30 seconds)

You'll see a URL when ready: `https://autoshop-xxx.vercel.app`

---

## Step 6: Verify It Works (3 minutes)

After deployment completes:

1. Click the generated URL to visit your site
2. Open browser DevTools: Press `F12`
3. Go to Network tab
4. Try clicking "Add to Cart" on a product
5. You should see API request in Network tab going to your backend
6. If successful, you'll see response from backend

### Success signs:
- ✅ Page loads without 404 errors
- ✅ No red errors in console (red X icon)
- ✅ Images load
- ✅ API requests show in Network tab with 200 status

### If something fails:
- Check browser console (F12 → Console tab)
- Look for error messages
- Most common: `CORS error` or `Cannot reach backend`

---

## Step 7: Update Backend CORS (1 minute)

Now you have your Vercel URL, update your backend to accept requests from it:

**Your Vercel URL format:** `https://autoshop-xxx.vercel.app`

1. Go to your backend platform (Railway/Render dashboard)
2. Find your backend service
3. Edit Environment Variables
4. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://autoshop-xxx.vercel.app
   ```
5. Save/Restart service

This allows your backend to accept requests from your new Vercel domain.

---

## Step 8: Test Again (2 minutes)

After backend CORS is updated:

1. Go back to https://autoshop-xxx.vercel.app
2. Refresh the page (Ctrl+R)
3. Try adding to cart again
4. Should work without CORS errors

---

## Done! 🎉

Your AutoShop is now live on Vercel!

### Your URLs:
- **Frontend**: https://autoshop-xxx.vercel.app
- **Backend**: https://your-backend-url/api
- **Admin Dashboard**: https://autoshop-xxx.vercel.app/admin (if applicable)

---

## Next: Custom Domain (Optional)

To use your own domain (e.g., autofixkenya.co.ke):

1. In Vercel dashboard → Your Project → Settings → Domains
2. Click "Add"
3. Enter your domain: `autofixkenya.co.ke`
4. Vercel provides DNS records
5. Update your domain registrar's DNS settings to Vercel's nameservers
6. Wait 24-48 hours for DNS to propagate

---

## Troubleshooting This Page

### Build failed
```
Error: Cannot find module 'package'
```
→ Run `npm run setup` locally first to verify all dependencies install

### CORS errors in console
```
Access to XMLHttpRequest blocked by CORS policy
```
→ Update backend `CORS_ORIGIN` to your Vercel URL and restart

### "Cannot reach backend" or 502 errors
```
GET https://your-backend-url/api/products 502
```
→ Check if backend is running
→ Verify `NEXT_PUBLIC_API_URL` is correct
→ Check backend logs for errors

### Images broken (404 on images)
```
GET https://your-backend-url/uploads/product1.jpg 404
```
→ Backend `/uploads` endpoint not working
→ Check if backend is serving static files correctly

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Build fails with "command not found" | Verify `npm run setup` works locally |
| Frontend loads but no API data | Update backend `CORS_ORIGIN` |
| Cart button doesn't work | Check Network tab for API errors |
| Images don't load | Verify backend `/uploads` path |
| 502 Bad Gateway | Backend service is down or crashed |

---

## What Just Happened?

1. **Vercel imported your code** from GitHub
2. **Built your Next.js app** (created optimized production files)
3. **Deployed to Vercel's CDN** across 30+ global locations
4. **Assigned a free URL** to your project
5. **Configured automatic deployments** (new pushes to main branch auto-deploy)

Your frontend now:
- Loads in <100ms from closest server globally
- Has built-in SSL/HTTPS
- Auto-scales with traffic
- Gets automatic backups

---

## Next Steps

1. **Test thoroughly** on the live URL
2. **Share with others** and get feedback
3. **Enable custom domain** if you have one
4. **Set up monitoring** (Vercel has built-in analytics)
5. **Create CI/CD** for automatic testing (optional)

---

## Auto-Deployments

From now on, every time you push to `main` branch:

```bash
git add .
git commit -m "Fix product listing"
git push origin main
```

Vercel automatically:
1. Builds your code
2. Runs tests (if configured)
3. Deploys new version
4. Makes it live in ~2 minutes

No manual deployment needed!

---

## Monitoring & Support

### View your deployment:
- Vercel Dashboard: https://vercel.com/dashboard
- Your project deployments: https://vercel.com/dashboard/yourusername/autoshop

### View logs:
- Click "Deployments" tab
- Click the deployment
- Scroll to "Build Logs" or "Function Logs"

### Get help:
- Vercel Support: https://vercel.com/support
- Check deployment logs first for error messages
- Include error messages when asking for help

---

## Celebrate! 🚀

Your AutoShop is now deployed to production and accessible worldwide!

Questions? Check the deployment guides or Vercel documentation.
