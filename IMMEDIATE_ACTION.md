# ⚡ Immediate Action Required

The `vercel.json` issue is fixed. Now follow these steps in the Vercel dashboard:

---

## In Vercel Dashboard (5 minutes)

### 1. Go to Settings
- https://vercel.com/dashboard/autoshop
- Click **"Settings"** tab

### 2. Set Root Directory
- Click **"Git"** on left sidebar
- Click **"Edit"** next to "Root Directory"
- Enter: `frontend`
- Click **"Save"**

### 3. Add Environment Variables
- Click **"Environment Variables"** on left sidebar
- Add each variable below:

```
NEXT_PUBLIC_API_URL = https://autoshop-fj4r.onrender.com/api
NEXTAUTH_SECRET = 59vkebXTZW7FhKq5Yw/QjpSFW5gMaOiMb/616nen5wI=
NEXT_PUBLIC_SITE_URL = https://autofixkenya.co.ke
NEXTAUTH_URL = https://autoshop-ashen.vercel.app
```

For each variable:
- Click "Add New..."
- Enter the key and value
- Check all 3 boxes (Production, Preview, Development)
- Click "Save"

### 4. Redeploy
- Go to **"Deployments"** tab
- Find failed deployment (red status)
- Click **"..."** menu
- Select **"Redeploy"**
- Click **"Redeploy"** button

**Wait 2-5 minutes for build to complete...**

---

## After Build Succeeds ✅

### 5. Copy Your Vercel URL
- Go to Deployments tab
- Click the green checkmark (successful deployment)
- Copy the URL at the top (e.g., `https://autoshop-ashen.vercel.app`)

### 6. Update Render CORS
- Go to https://dashboard.render.com
- Click your Web Service (backend)
- Click "Environment" tab
- Find `CORS_ORIGIN` variable
- Update to:
  ```
  CORS_ORIGIN = https://autoshop-ashen.vercel.app,https://autofixkenya.co.ke,http://localhost:3000
  ```
  (Replace with your actual Vercel URL)
- Click "Save"

**Wait 2-3 minutes for Render to redeploy...**

### 7. Test Frontend
- Visit your Vercel URL
- Open DevTools (F12)
- Check Console for errors
- Run this in console:
  ```javascript
  fetch('https://autoshop-fj4r.onrender.com/api/cart')
    .then(r => r.json())
    .then(d => console.log('✅ Works:', d))
    .catch(e => console.error('❌ Error:', e))
  ```
- Should NOT see CORS error

---

## Done! 🎉

If everything works:
- ✅ Backend: https://autoshop-fj4r.onrender.com
- ✅ Frontend: https://autoshop-ashen.vercel.app (or your URL)
- ✅ Database: Render PostgreSQL (migrated)
- ✅ Full integration working

---

## Questions?

See **VERCEL_DASHBOARD_SETUP.md** for detailed troubleshooting and step-by-step screenshots.

