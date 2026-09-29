# Vercel Redeploy - Fixed Configuration

## What Was Wrong
The `vercel.json` had extra properties that Vercel doesn't accept in its schema validation.

## What I Fixed ✅
Simplified `vercel.json` to only contain:
```json
{
  "root": "frontend"
}
```

This tells Vercel that the frontend code is in the `frontend/` directory and to auto-detect everything else.

---

## How to Redeploy Now

### Go to Vercel Dashboard

1. **Visit**: https://vercel.com/dashboard/autoshop
2. **Look for**: "autoshop-ashen.vercel.app" (your project)
3. **Click on failed deployment** (the red one)

### Option A: Redeploy Button
1. Click the **"..."** (three dots) menu
2. Select **"Redeploy"**
3. Click **"Redeploy"** button in the dialog
4. Keep "Use existing Build Cache" checked
5. Click **"Redeploy"** to start

### Option B: Through Settings
1. Go to **"Settings"** tab
2. Click **"Git"** on the left sidebar
3. Find **"main"** branch
4. Click the **"Redeploy"** button next to it

---

## What Should Happen

The build should now succeed because:
- ✅ Vercel will read the simplified `vercel.json`
- ✅ Auto-detect that it's Next.js (from `package.json` in `frontend/`)
- ✅ Build command: `npm run build` in `frontend/` directory
- ✅ Output directory: `.next` in `frontend/`
- ✅ Use environment variables from Vercel dashboard

**Expected build time**: 2-5 minutes

**Expected result**: 
- Status: ✅ **Ready**
- Domain: `autoshop-ashen.vercel.app` (or custom domain)
- All checks passing

---

## Environment Variables Setup (If Not Already Done)

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://autoshop-fj4r.onrender.com/api` |
| `NEXTAUTH_SECRET` | `59vkebXTZW7FhKq5Yw/QjpSFW5gMaOiMb/616nen5wI=` |
| `NEXT_PUBLIC_SITE_URL` | `https://autofixkenya.co.ke` |
| `NEXTAUTH_URL` | `https://autoshop-ashen.vercel.app` (or your domain) |

These are needed for the frontend to:
- Know where the backend API is located
- Authenticate users properly
- Set the correct public URLs for metadata/redirects

---

## After Successful Deployment

Once you see "Ready" status:

1. **Get Your Frontend URL**
   - Displayed on the deployment page
   - Usually: `https://autoshop-ashen.vercel.app`

2. **Update Render CORS**
   - Go to https://dashboard.render.com
   - Click your Web Service (backend)
   - Go to Environment variables
   - Update `CORS_ORIGIN`:
     ```
     CORS_ORIGIN = https://autoshop-ashen.vercel.app,https://autofixkenya.co.ke,http://localhost:3000
     ```
   - Click Save (Render redeploys automatically)
   - Wait 2-3 minutes for new deployment

3. **Test Frontend**
   - Open: `https://autoshop-ashen.vercel.app`
   - Open DevTools (F12)
   - Check console for errors
   - No CORS errors should appear

4. **Test API Connection**
   - In browser console, run:
     ```javascript
     fetch('https://autoshop-fj4r.onrender.com/api/cart')
       .then(r => r.json())
       .then(d => console.log('Success:', d))
       .catch(e => console.error('Error:', e))
     ```
   - Should see API response, not CORS error

---

## Troubleshooting

### Still getting schema error?

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Hard refresh Vercel dashboard**: Ctrl+Shift+R
3. **Check GitHub**: Make sure latest commit is pushed
   ```bash
   cd /home/phil/projects/autoshop
   git log --oneline -1
   # Should show: "Simplify vercel.json..."
   ```
4. **Manual check of vercel.json**:
   ```bash
   cat /home/phil/projects/autoshop/vercel.json
   # Should only contain: {"root": "frontend"}
   ```

### Build fails after redeploy?

Check the build logs:
1. Click the deployment
2. Click "Logs" or "View Deployment Logs"
3. Look for error messages like:
   - `npm ERR`: Missing dependencies → run `npm install` locally
   - `TypeScript error`: Fix in code and push
   - `Next.js error`: Check Next.js config

### Frontend loads but API calls fail?

1. Verify Render `CORS_ORIGIN` was updated with your Vercel URL
2. Wait 2-3 minutes for Render to redeploy
3. Check Render backend logs:
   - Render Dashboard → Web Service → Logs
   - Look for CORS or connection errors
4. Hard refresh frontend (Ctrl+Shift+R)

---

## Success Checklist

- [ ] Redeploy triggered in Vercel
- [ ] Build completes with ✅ Ready status
- [ ] Get your Vercel URL (e.g., https://autoshop-ashen.vercel.app)
- [ ] Updated Render CORS_ORIGIN
- [ ] Render redeployed successfully
- [ ] Frontend loads in browser
- [ ] No CORS errors in console
- [ ] API calls work (test with fetch)
- [ ] Database queries work (cart, listings, etc.)

---

## You're Almost There! 🚀

The fix is already pushed. Just redeploy in Vercel and you're done!

Let me know when you trigger the redeploy and I'll help verify everything works.

