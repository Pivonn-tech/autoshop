# Fix: DNS Domain & Image Rendering Issues

## Problem 1: Domain Not Available on Phone (DNS Issue)

The domain `autofixkenya.co.ke` is not resolving to your Vercel deployment.

### Root Cause
Your domain's DNS records are not pointing to Vercel.

### Solution

#### Step 1: Get Your Vercel DNS Records

1. Go to [Vercel Dashboard](https://vercel.com/dashboard/autoshop)
2. Click **"Settings"** → **"Domains"**
3. You should see: `autoshop-ashen.vercel.app` listed
4. To add custom domain:
   - Click **"Add"** → Enter `autofixkenya.co.ke`
   - Vercel will show you nameservers or DNS records

#### Option A: Using Nameservers (Recommended - Easier)

Vercel will show something like:
```
ns1.vercel.com
ns2.vercel.com
ns3.vercel.com
ns4.vercel.com
```

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find **Nameservers** settings
3. Replace the current nameservers with Vercel's nameservers
4. Save changes
5. Wait 24-48 hours for DNS propagation

#### Option B: Using CNAME/A Records (Alternative - If you can't use nameservers)

Vercel will show records like:
```
CNAME: autofixkenya.co.ke -> cname.vercel-dns.com
```

1. Go to your domain registrar's DNS records
2. Add/Update the CNAME record as shown by Vercel
3. Save changes
4. Wait 24-48 hours for DNS propagation

#### Step 2: Verify DNS is Working

Once DNS is updated, test it:

```bash
# From terminal
nslookup autofixkenya.co.ke

# Or in browser
Visit https://autofixkenya.co.ke
```

Should show Vercel's IP address and load your frontend.

---

## Problem 2: Images Not Rendering

### Root Cause Analysis

Your backend is correctly configured to serve images. The issue may be:

1. **CORS headers** - Frontend can't fetch from backend
2. **Image path mismatch** - Images saved to wrong location
3. **Render backend** - Not running or not accessible
4. **Image upload** - Images never actually uploaded

### Solution

#### Check 1: Verify Backend is Running

```bash
curl https://autoshop-fj4r.onrender.com/health
```

Should return:
```json
{"status":"OK","uptime":123.45}
```

If it fails: Backend is down or URL is wrong.

#### Check 2: Verify Image Serving

```bash
# List all uploads on backend
curl https://autoshop-fj4r.onrender.com/uploads/cars/
```

Should show a directory listing if any images exist.

#### Check 3: Test Image URL Directly

If you have a car listing with images, get the image URL from the database:

```bash
# From your machine:
psql "postgresql://autoshop:***@dpg-datpsspsrm7s739lju1g-a.singapore-postgres.render.com/autoshop_flyi" \
  -c "SELECT images FROM \"CarListing\" LIMIT 1;"
```

This will show the JSON array of image objects with URLs like:
```
/uploads/cars/abc123.webp
```

Try visiting: `https://autoshop-fj4r.onrender.com/uploads/cars/abc123.webp`

#### Check 4: Verify Frontend API URL

In Vercel dashboard, check environment variables:

1. Go: https://vercel.com/dashboard/autoshop
2. Settings → Environment Variables
3. Verify `NEXT_PUBLIC_API_URL` = `https://autoshop-fj4r.onrender.com/api`

#### Check 5: Check Browser Console

Open your app in browser (https://autoshop-ashen.vercel.app):

1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Go to **Network** tab
4. Try loading a page with images
5. Look for failed requests

Common errors:
- **CORS error**: Backend not allowing requests from Vercel
  - Fix: Update `CORS_ORIGIN` in Render environment
- **404 on image**: Image path is wrong
  - Fix: Check database for actual image paths
- **ERR_CONNECTION_REFUSED**: Backend is down
  - Fix: Restart Render service or check logs

#### Check 6: Render CORS Settings

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click Web Service (backend)
3. Click **"Environment"** tab
4. Find `CORS_ORIGIN`
5. Should include your Vercel URL:
   ```
   CORS_ORIGIN = https://autoshop-ashen.vercel.app,https://autofixkenya.co.ke,http://localhost:3000
   ```
6. If not, update it and save (Render will redeploy)

---

## Quick Diagnosis Checklist

### For DNS Issue:
- [ ] Domain registered? (Check registrar)
- [ ] DNS records updated? (Check nameservers at registrar)
- [ ] DNS propagated? (Wait 24-48h, then test `nslookup`)
- [ ] Can ping domain? (`ping autofixkenya.co.ke`)
- [ ] Works in browser? (Try https://autofixkenya.co.ke)

### For Image Rendering:
- [ ] Backend running? (`curl /health`)
- [ ] Images exist in database? (`SELECT COUNT(*) FROM "CarListing"`)
- [ ] Image URLs are correct? (`SELECT images FROM "CarListing"`)
- [ ] CORS configured? (`CORS_ORIGIN` includes your domain)
- [ ] Can fetch images? (`curl /uploads/cars/...`)
- [ ] Frontend has correct API URL? (Check env vars)
- [ ] No 404s in Network tab? (Check DevTools)

---

## Immediate Actions

### Now (Do This First)

**For DNS:**
1. Invite domain registrar
2. Update nameservers to Vercel's nameservers
3. Or add CNAME record as shown by Vercel
4. Wait for propagation (24-48 hours)

**For Images:**
1. Open browser DevTools (F12)
2. Check Network tab for failed requests
3. Note exact error messages
4. Check if image URLs are being sent from backend
5. Verify `NEXT_PUBLIC_API_URL` is correct

### If Images Still Don't Show

Add this to your Vercel environment if not already there:

```
NEXT_PUBLIC_CDN_URL = https://autoshop-fj4r.onrender.com
```

This tells frontend to use backend as CDN for images.

---

## DNS Propagation Helper

To check DNS status:

```bash
# On Mac/Linux:
nslookup autofixkenya.co.ke
dig autofixkenya.co.ke

# Or use online tool:
# https://mxtoolbox.com/nslookup
# https://dnschecker.org
```

You should see Vercel's IP address when resolved.

---

## Image Storage Backend Setup

Your backend is configured to:

1. **Save images** to: `/uploads/cars/` (local disk on Render)
2. **Serve images** from: `GET /uploads/cars/:filename`
3. **Filename format**: `{uuid}.webp` (e.g., `abc123def456.webp`)
4. **Image processing**: Optimized to WebP, resized to 1200x900px

Images are automatically:
- ✅ Compressed to WebP
- ✅ Resized for optimal display
- ✅ Thumbnail created for listings
- ✅ Stored with unique UUID
- ✅ Served with proper CORS headers

No additional configuration needed - backend is ready!

---

## Testing Image Upload

1. Go to: https://autoshop-ashen.vercel.app/sell-car
2. Fill form and upload images
3. Check browser DevTools Network tab
4. Look for `POST /api/car-listings` request
5. Should return: `201 Created` with image URLs

If you see an error, the image upload failed. Check:
- File size < 10MB
- File format: JPEG, PNG, WebP
- Network request response for error message

---

## Still Having Issues?

Run this diagnostic:

```bash
# Test backend health
curl -I https://autoshop-fj4r.onrender.com/health

# Test image serving
curl -I https://autoshop-fj4r.onrender.com/uploads/cars/

# Test CORS
curl -H "Origin: https://autoshop-ashen.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -I https://autoshop-fj4r.onrender.com/api/products
```

Share the results and I can diagnose further.

---

## Next Steps

1. ✅ Update domain DNS records (24-48h wait)
2. ✅ Test domain resolves (use nslookup)
3. ✅ Check image rendering in DevTools
4. ✅ Verify CORS_ORIGIN in Render
5. ✅ Test image upload and verify in database

Once DNS propagates, domain will work on phone. Images should already work if backend is accessible!

