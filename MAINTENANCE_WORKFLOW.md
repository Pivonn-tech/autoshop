# AutoShop Maintenance Workflow

## Overview
This guide provides a complete workflow for deploying changes to your production site with zero downtime and minimal disruption to users.

## Pre-Deployment Checklist

- [ ] All changes tested locally with `npm run dev`
- [ ] Database migrations tested locally
- [ ] API changes verified with manual testing
- [ ] UI changes verified across browsers/devices
- [ ] No uncommitted changes
- [ ] Code is pushed to your deployment branch

## Step-by-Step Deployment Process

### 1. Enable Maintenance Mode (Production)

When you're ready to deploy, enable maintenance mode on your live server:

```bash
npm run maintenance:on
```

This command:
- ✅ Sets `maintenance.enabled = true` in `maintenance.json`
- ✅ Backend middleware starts returning 503 Service Unavailable
- ✅ Frontend automatically detects and displays maintenance page
- ✅ Takes effect immediately without redeploying
- ⏱️ No latency — changes appear within 5 seconds

**Verify it's working:**
```bash
npm run maintenance:status
```

### 2. Deploy Your Changes

Deploy your code to production as usual:

```bash
# Example for Vercel (frontend)
vercel deploy --prod

# Example for Render (backend)
git push render main
```

**During this time:**
- Users see the maintenance page
- API requests return 503 with maintenance info
- Your database migrations run safely
- No partial page loads or errors reach users

### 3. Run Database Migrations (if needed)

If you have new database migrations:

```bash
# SSH into your backend server or run migrations remotely
npm run migrate
```

Or through your deployment provider's dashboard (Render, etc.)

### 4. Test Your Changes on Production

While maintenance mode is still active, you can safely test:

```bash
# Health check (always works)
curl https://api.autoshop.com/health

# To bypass maintenance mode for testing, use a special header (optional):
# curl -H "X-Bypass-Maintenance: testing-token" https://api.autoshop.com/products
```

### 5. Disable Maintenance Mode

When everything checks out:

```bash
npm run maintenance:off
```

This command:
- ✅ Sets `maintenance.enabled = false` in `maintenance.json`
- ✅ Backend middleware stops intercepting requests
- ✅ Frontend displays normal site
- ✅ Takes effect immediately
- ⏱️ No downtime required

**Verify the site is live:**
```bash
npm run maintenance:status
```

## Customizing Maintenance Messages

### Update Maintenance Reason

```bash
npm run maintenance:set reason "Database migration in progress — should be back soon"
```

### Update Estimated Time

```bash
npm run maintenance:set estimatedTime "45 minutes"
```

### Update Contact Email

```bash
npm run maintenance:set contact "support@example.com"
```

## Maintenance Page Features

The maintenance page automatically displays:
- ✅ Main reason for maintenance
- ✅ Estimated time until restoration
- ✅ Support contact information
- ✅ Professional, branded design
- ✅ Responsive on all devices
- ✅ No JavaScript errors (works even if site is broken)
- ✅ Beautiful animated gradient background

## Emergency Scenarios

### Quick Recovery

If something goes wrong during deployment:

```bash
# Immediately disable maintenance
npm run maintenance:off

# Users are back on the live site within seconds
```

### Partial Deployment (Multi-Server)

If you're running multiple backend servers:

1. Disable maintenance mode
2. Gradually deploy changes to individual servers (blue-green deployment)
3. No need for full maintenance window

### Long Maintenance

For maintenance exceeding 1 hour:

```bash
# Update message periodically
npm run maintenance:set estimatedTime "1 hour, 15 minutes remaining"
npm run maintenance:set reason "Large database migration + performance optimizations"
```

## Monitoring During Maintenance

### Check Current Status Anytime

```bash
npm run maintenance:status

# Output:
# ╔════════════════════════════════════════════════════════╗
# ║                 MAINTENANCE MODE STATUS                ║
# ╠════════════════════════════════════════════════════════╣
# ║ Status:        🔴 ACTIVE
# ║ Reason:        Database migration in progress
# ║ Est. Time:     30 minutes
# ║ Contact:       support@autoshop.com
# ║ Last Updated:  9/30/2026, 2:45 PM
# ╚════════════════════════════════════════════════════════╝
```

### View Recent Changes

Edit `maintenance.json` directly to see:
- Last update timestamp
- Current settings
- Previous message history (in git)

## Technical Details

### How It Works

1. **Flag File**: `/maintenance.json` controls the state
2. **Backend**: `backend/src/middleware/maintenance.js` checks this file every 5 seconds
3. **Frontend**: `useMaintenance` hook polls `/api/health` every 30 seconds
4. **No redeployment needed**: Changes take effect immediately

### Files Involved

| File | Purpose |
|------|---------|
| `maintenance.json` | Central control file |
| `backend/src/middleware/maintenance.js` | Express middleware |
| `frontend/components/MaintenancePage.tsx` | Maintenance UI |
| `frontend/lib/useMaintenance.ts` | React hook for detection |
| `frontend/pages/_app.tsx` | App wrapper with maintenance check |
| `scripts/maintenance.js` | CLI tool |
| `package.json` | NPM commands |

### API Responses During Maintenance

All API endpoints return:

```json
{
  "status": "maintenance",
  "message": "We are currently under maintenance. Please try again later.",
  "reason": "Database migration in progress",
  "estimatedTime": "30 minutes",
  "contact": "support@autoshop.com"
}
```

HTTP Status: `503 Service Unavailable`

### Exempted Endpoints

These endpoints are NOT blocked during maintenance:
- `/health` - Health check
- `/api/health` - Health check
- `/maintenance/status` - Check maintenance info (optional)

## Best Practices

✅ **DO:**
- Test all changes locally first
- Run migrations locally to catch errors
- Keep maintenance windows short
- Update maintenance message with realistic estimates
- Monitor site performance after deployment
- Keep users informed with clear messages

❌ **DON'T:**
- Deploy untested code
- Skip local testing
- Leave maintenance mode on for extended periods
- Update code without testing database migration
- Ignore error messages from backend logs

## Troubleshooting

### Maintenance Mode Won't Enable

```bash
# Check file permissions
ls -la maintenance.json

# Verify JSON is valid
cat maintenance.json

# Manually check
npm run maintenance:status
```

### Site Still Shows Old Version

```bash
# Hard refresh browser
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)

# Clear browser cache
# Or use incognito/private window
```

### Backend Not Recognizing Changes

```bash
# Check that middleware is loaded in backend/src/index.js
grep -n "maintenanceMiddleware" backend/src/index.js

# Restart backend service
npm run dev:backend

# Check logs for middleware initialization
```

### Users Report Wrong Message

```bash
# Update the maintenance message
npm run maintenance:set reason "New message here"

# Refresh browser (users may need hard refresh)
```

## Post-Deployment Checklist

After disabling maintenance mode:

- [ ] Site loads without errors
- [ ] API endpoints responding normally
- [ ] Database queries working
- [ ] Authentication working
- [ ] Payment/cart functionality working
- [ ] Images loading correctly
- [ ] No console errors
- [ ] Response times normal
- [ ] Monitor error logs for 30 minutes
- [ ] Notify stakeholders of successful deployment

## Maintenance Window Examples

### Quick Hotfix (5-10 minutes)

```bash
npm run maintenance:on
npm run maintenance:set reason "Critical bug fix in progress"
npm run maintenance:set estimatedTime "10 minutes"
# Deploy code
npm run maintenance:off
```

### Database Migration (20-30 minutes)

```bash
npm run maintenance:on
npm run maintenance:set reason "Database migration and performance optimizations"
npm run maintenance:set estimatedTime "30 minutes"
# Deploy code
npm run migrate
# Verify everything
npm run maintenance:off
```

### Major Release (1+ hours)

```bash
npm run maintenance:on
npm run maintenance:set reason "Major release deployment - new features, performance improvements"
npm run maintenance:set estimatedTime "1 hour"
npm run maintenance:set contact "support@autoshop.com"
# Deploy code in phases
# Run all migrations
# Run comprehensive testing
npm run maintenance:off
```

## Support

For issues or questions:
- Check `npm run maintenance:status`
- Review backend logs: `.logs/backend.log`
- Check frontend console for errors
- Verify `maintenance.json` is valid JSON
- Ensure backend has permission to read/write `maintenance.json`
