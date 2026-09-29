# Complete Vercel Dashboard Setup - No vercel.json

## What I Did
Removed `vercel.json` to avoid schema validation issues. Now we'll configure everything directly in the Vercel dashboard.

---

## Step 1: Go to Vercel Project Settings

1. Visit: https://vercel.com/dashboard
2. Click your project: **autoshop**
3. Click the **"Settings"** tab at the top

---

## Step 2: Configure Root Directory

In Settings, find **"Git"** section on the left menu:

### Root Directory
- Click **"Edit"** next to "Root Directory"
- Enter: `frontend`
- Click **"Save"**

This tells Vercel to deploy from the `frontend/` folder.

---

## Step 3: Configure Build Settings

Still in Settings, scroll down to find **"Build & Development Settings"** section:

### Framework Preset
- Leave as: **"Next.js"** (auto-detected)

### Build Command
- **Change from**: `npm run build`
- **To**: `npm run build`
- (Keep it the same - Next.js default)

### Output Directory
- Leave as: `.next` (auto-detected)

### Install Command
- Leave as: `npm install`

Click **"Save"** if you made changes.

---

## Step 4: Add Environment Variables

In Settings, click **"Environment Variables"** on the left menu.

Add these variables (if not already there):

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://autoshop-fj4r.onrender.com/api` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `59vkebXTZW7FhKq5Yw/QjpSFW5gMaOiMb/616nen5wI=` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://autofixkenya.co.ke` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://autoshop-ashen.vercel.app` | Production (update with your actual URL) |

**How to add:**
1. Click **"Add New..."** button
2. Enter Key name (e.g., `NEXT_PUBLIC_API_URL`)
3. Enter Value
4. Select checkboxes for which environments (select all 3)
5. Click **"Save"**
6. Repeat for each variable

---

## Step 5: Redeploy

Now trigger a new deployment:

1. Go to **"Deployments"** tab
2. Look for the failed deployment (red status)
3. Click the **"..."** menu
4. Select **"Redeploy"**
5. Click **"Redeploy"** button in the dialog

---

## What Should Happen

✅ Vercel will:
- Pull latest code from GitHub (with removed `vercel.json`)
- Read Root Directory: `frontend`
- Auto-detect Next.js framework
- Run: `npm install` in `frontend/`
- Run: `npm run build` in `frontend/`
- Deploy `.next` output directory

✅ Build time: 2-5 minutes

✅ Status should change to: **"Ready"** ✅

---

## Step 6: Get Your Vercel URL

Once deployment succeeds:

1. Go to **"Deployments"** tab
2. Click the successful deployment (green checkmark)
3. At the top, you'll see your URL:
   ```
   https://autoshop-ashen.vercel.app
   (or whatever your custom domain is)
   ```

**Copy this URL** - you'll need it for the next step.

---

## Step 7: Update Render CORS

Now that you have your Vercel URL, update the backend to allow requests:

1. Go to: https://dashboard.render.com
2. Click your **Web Service** (backend)
3. Click **"Environment"** tab
4. Find the `CORS_ORIGIN` variable
5. Update it to:
   ```
   CORS_ORIGIN = https://autoshop-ashen.vercel.app,https://autofixkenya.co.ke,http://localhost:3000
   ```
   (Replace `autoshop-ashen.vercel.app` with your actual URL)
6. Click **"Save"**

Render will redeploy automatically (~2 minutes).

---

## Step 8: Verify Everything Works

### Test 1: Frontend Loads
1. Visit your Vercel URL: `https://autoshop-ashen.vercel.app`
2. Should load without errors
3. No blank page or 500 errors

### Test 2: Check Console
1. Open DevTools: Press **F12**
2. Go to **Console** tab
3. Should NOT see CORS errors
4. Should NOT see "Cannot reach API" errors

### Test 3: Test API Connection
In browser console, run:
```javascript
fetch('https://autoshop-fj4r.onrender.com/api/cart')
  .then(r => r.json())
  .then(d => console.log('✅ API works:', d))
  .catch(e => console.error('❌ Error:', e.message))
```

Should see: `✅ API works: []` (or your cart data)

If you see CORS error:
- Wait 2-3 more minutes for Render to finish redeploying
- Hard refresh: `Ctrl+Shift+R`
- Try the fetch again

### Test 4: Navigate Your App
- Load home page
- Browse products/listings
- Add items to cart
- Check authentication (login/signup)

All should work without API errors.

---

## Troubleshooting

### Build Still Failing?

1. **Check build logs**:
   - Go to Vercel → Deployments → click failed build
   - Click "Logs" button
   - Look for error messages

2. **Common errors**:
   - `npm ERR`: Dependencies missing
     - Solution: `cd frontend && npm install` locally, then push
   - `error TS2345`: TypeScript error
     - Solution: Fix the error in code, commit, push
   - `Cannot find module`: Missing import
     - Solution: Install the package, commit, push

3. **If still stuck**:
   - Delete `.next` folder locally: `rm -rf frontend/.next`
   - Clear npm cache: `npm cache clean --force`
   - Reinstall: `cd frontend && npm install`
   - Rebuild: `npm run build`
   - Push to GitHub
   - Redeploy in Vercel

### Frontend Loads But API Calls Fail?

1. Verify `NEXT_PUBLIC_API_URL` in Vercel settings
2. Verify `CORS_ORIGIN` in Render backend settings
3. Wait 2-3 minutes for Render to redeploy after you updated CORS_ORIGIN
4. Hard refresh in browser: `Ctrl+Shift+R`
5. Check browser console for exact error message
6. Check Render backend logs: Dashboard → Web Service → Logs

### CORS Error in Console?

```
Access to fetch at 'https://autoshop-fj4r.onrender.com/api/...'
from origin 'https://autoshop-ashen.vercel.app' has been blocked by CORS policy
```

**Solutions**:
1. Verify your Vercel URL is in `CORS_ORIGIN` exactly as shown
2. Wait for Render to redeploy (2-3 minutes after saving)
3. Hard refresh (Ctrl+Shift+R) and try again
4. Check Render backend logs for CORS errors

### Blank Page or 500 Error?

1. Open browser console (F12)
2. Check for JavaScript errors
3. Go to Network tab → check for failed requests
4. Check Vercel Function Logs:
   - Vercel Dashboard → Project → Runtime Logs tab
5. Look for which request is failing
6. Check Render logs if API request fails

---

## Success Checklist

- [ ] Removed `vercel.json` (git push complete)
- [ ] Set Root Directory to `frontend` in Vercel settings
- [ ] Added all environment variables in Vercel settings
- [ ] Triggered redeploy in Vercel
- [ ] Build completed with ✅ Ready status
- [ ] Got Vercel URL (e.g., https://autoshop-ashen.vercel.app)
- [ ] Updated Render `CORS_ORIGIN` with Vercel URL
- [ ] Render redeployed successfully
- [ ] Frontend loads in browser without errors
- [ ] Console shows NO CORS errors
- [ ] API fetch test works (see Test 3 above)
- [ ] Can navigate app and use features
- [ ] Database queries work (cart loads, etc.)

---

## You're Almost There! 🚀

The configuration is now simplified and should work. Just:
1. **Redeploy in Vercel** (Settings → Git → Redeploy)
2. **Update Render CORS** with your Vercel URL
3. **Test everything**

Let me know when deployment succeeds and I'll help verify the integration!

