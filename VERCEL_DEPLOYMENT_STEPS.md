# Deploy Frontend to Vercel - Step by Step

Your code has been pushed to GitHub. Now deploy to Vercel using the web dashboard.

## Quick Summary

- **Backend**: Running at https://autoshop-fj4r.onrender.com ✅
- **Database**: Migrated to Render PostgreSQL ✅
- **Frontend**: Ready to deploy to Vercel (you are here)

---

## Step 1: Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Sign in with your GitHub account (or create one)

---

## Step 2: Import Your Project

1. Click **"Add New..."** button
2. Select **"Project"**
3. Click **"Continue with GitHub"**
4. Select your repository: **Pivonn-tech/autoshop**
5. Click **"Import"**

---

## Step 3: Configure Project

On the Import dialog:

**Project Name**: `autoshop` (or any name you prefer)

**Framework Preset**: Should auto-detect as **Next.js** ✓

**Root Directory**: 
- Click **"Edit"** if needed
- Set to: `frontend`
- Click **"Save"**

**Build and Output Settings**:
- These should auto-populate with Next.js defaults
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

---

## Step 4: Add Environment Variables

This is CRITICAL - your frontend needs to know the backend URL.

On the same import dialog, scroll down to **"Environment Variables"** section.

Add these variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://autoshop-fj4r.onrender.com/api` |
| `NEXTAUTH_URL` | (Will be your Vercel URL - update after deployment) |
| `NEXTAUTH_SECRET` | `59vkebXTZW7FhKq5Yw/QjpSFW5gMaOiMb/616nen5wI=` |
| `NEXT_PUBLIC_SITE_URL` | `https://autofixkenya.co.ke` |

**Note**: You can add more environment variables after deployment. The most important one is `NEXT_PUBLIC_API_URL`.

---

## Step 5: Deploy

1. Click **"Deploy"** button
2. Vercel will start building and deploying
3. This takes 2-5 minutes
4. You'll see a progress screen with a URL when done

Example URL: `https://autoshop-xxxxx.vercel.app`

---

## Step 6: Get Your Vercel URL

After deployment completes:

1. You'll see your deployment preview
2. Copy your Vercel URL (e.g., `https://autoshop-xxxxx.vercel.app`)
3. **Save this URL**

---

## Step 7: Update Render CORS

Now update your Render backend to allow requests from your Vercel frontend:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your **Web Service** (backend)
3. Click **"Environment"** tab
4. Find `CORS_ORIGIN` variable
5. Update it to include your Vercel URL:
   ```
   CORS_ORIGIN = https://autoshop-xxxxx.vercel.app,https://autofixkenya.co.ke,http://localhost:3000
   ```
6. Click **"Save"**

Render will automatically redeploy with the new setting (~2 minutes).

---

## Step 8: Update Vercel Environment Variables

Now that you have your Vercel URL, update it in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your **autoshop** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** on the left
5. Find `NEXTAUTH_URL` and update to your Vercel URL:
   ```
   NEXTAUTH_URL = https://autoshop-xxxxx.vercel.app
   ```
6. Click **"Save"**

Vercel will automatically redeploy with the updated variable.

---

## Step 9: Verify Frontend is Working

1. Open your Vercel URL in browser: `https://autoshop-xxxxx.vercel.app`
2. Should see your AutoShop homepage

**Check the browser console** (press F12):
- Should NOT see CORS errors
- Should NOT see "Cannot reach backend" errors

If you see errors:
- Wait 2-3 minutes for Render to redeploy with new CORS_ORIGIN
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser cache: `Ctrl+Shift+Delete` → Clear all

---

## Step 10: Test API Connection

Open browser console (F12) and run:

```javascript
fetch('https://autoshop-fj4r.onrender.com/api/cart')
  .then(r => r.json())
  .then(data => console.log('API Response:', data))
  .catch(e => console.error('Error:', e))
```

Should see: `API Response: []` or `API Response: {object}`

If error, check:
- CORS_ORIGIN in Render matches your Vercel URL
- Wait for Render to redeploy (watch the Render logs)
- Browser cache cleared

---

## Step 11: Test End-to-End

Navigate through your app:
- Load home page ✓
- Browse products/listings ✓
- Add to cart ✓
- Check if cart persists ✓

If everything works → **Deployment complete!** 🎉

---

## Troubleshooting

### "Cannot reach API" or CORS errors

**Problem**: Frontend can't communicate with backend

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` in Vercel settings
2. Verify `CORS_ORIGIN` in Render settings includes your Vercel URL
3. Wait 2-3 minutes for Render to redeploy
4. Hard refresh in browser (Ctrl+Shift+R)
5. Check Render logs (Render Dashboard → Web Service → Logs tab)

### "Vercel build failed"

**Problem**: Deployment failed

**Solution**:
1. Check Vercel build logs (Vercel Dashboard → Project → Deployments)
2. Common issues:
   - TypeScript errors: Fix in code
   - Missing dependencies: Run `npm install` locally and check
   - Environment variables: Add them in Vercel Settings

### Blank page in browser

**Problem**: Page loads but shows nothing

**Solution**:
1. Check browser console (F12) for errors
2. Check Vercel function logs (Vercel Dashboard → Project → Runtime Logs)
3. Check if API is reachable (see Step 10 above)

### Domain not working (autofixkenya.co.ke)

**For custom domain mapping** (optional):

1. In Vercel Dashboard → Project → Settings → Domains
2. Add: `autofixkenya.co.ke`
3. Follow instructions to update DNS records at your registrar
4. Update environment variables to use custom domain

---

## What You Have Now

✅ **Backend**: https://autoshop-fj4r.onrender.com
✅ **Database**: Render PostgreSQL (migrated from local)
✅ **Frontend**: https://autoshop-xxxxx.vercel.app
✅ **Custom Domain** (optional): https://autofixkenya.co.ke (when configured)

---

## Important URLs

Save these somewhere safe:

```
Render Dashboard:     https://dashboard.render.com
Vercel Dashboard:     https://vercel.com/dashboard
GitHub Repo:          https://github.com/Pivonn-tech/autoshop
Backend API:          https://autoshop-fj4r.onrender.com
Frontend (Vercel):    https://autoshop-xxxxx.vercel.app
Database (External):  postgresql://autoshop:***@dpg-datpsspsrm7s739lju1g-a.singapore-postgres.render.com/autoshop_flyi
```

---

## Next Steps After Deployment

1. ✅ Monitor Render and Vercel logs for errors
2. ✅ Test all major features (cart, checkout, listings, etc.)
3. ✅ Set up monitoring/alerts
4. ✅ Configure custom domain (optional)
5. ✅ Set up CI/CD for automatic deployments on push
6. ✅ Plan for scaling as traffic grows

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://docs.render.com
- **Next.js Docs**: https://nextjs.org/docs

Good luck with your deployment! 🚀

