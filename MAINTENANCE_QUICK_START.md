# Maintenance Mode - Quick Start

## One-Minute Setup

You've got everything ready to go! Here's what's installed:

✅ **Backend middleware** - Blocks API requests when maintenance is active  
✅ **Frontend detection** - Automatically shows maintenance page  
✅ **CLI commands** - Easy enable/disable via npm  
✅ **Maintenance page** - Beautiful, branded, responsive page  
✅ **Configuration** - Central `maintenance.json` file

## The 30-Second Deploy

```bash
# 1. Enable maintenance (immediate)
npm run maintenance:on

# 2. Deploy your changes
vercel deploy --prod  # or your deployment command

# 3. Run migrations if needed
npm run migrate

# 4. Verify everything works (or rollback)
# Test your changes while site is in maintenance

# 5. Disable maintenance (immediate)
npm run maintenance:off

# Done! Users are back online
```

## Commands Cheat Sheet

```bash
# Check status anytime
npm run maintenance:status

# Enable maintenance mode
npm run maintenance:on

# Disable maintenance mode
npm run maintenance:off

# Update what users see
npm run maintenance:set reason "New message here"
npm run maintenance:set estimatedTime "45 minutes"
npm run maintenance:set contact "support@example.com"
```

## What Users Will See

When maintenance is enabled, users get:
- 🎨 Professional maintenance page with your branding
- ⏱️ Estimated time to restoration
- 📧 Support contact information
- 📱 Responsive design (works on all devices)
- ♿ Accessible dark mode design

## How It Works (Technical)

**Backend**: Middleware checks `maintenance.json` every 5 seconds and returns 503 to all API requests  
**Frontend**: Polls `/api/health` every 30 seconds and switches to maintenance page when it gets 503  
**No redeployment needed**: Changes to `maintenance.json` take effect within seconds

## Common Scenarios

### I just deployed code and found a bug

```bash
npm run maintenance:off
# Site is back online in seconds
```

### I need to run a 30-minute database migration

```bash
npm run maintenance:on
npm run maintenance:set reason "Database migration — large dataset being restructured"
npm run maintenance:set estimatedTime "30 minutes"
npm run migrate
# Verify everything
npm run maintenance:off
```

### I want users to know about the maintenance

```bash
# This displays on the maintenance page automatically
npm run maintenance:set reason "Major feature release with performance improvements"
```

## Important Notes

⚠️ **maintenance.json is committed to git** — This is intentional so your team can see maintenance history  
⚠️ **Changes take effect immediately** — No server restart needed  
⚠️ **Health check endpoint bypasses maintenance** — `/health` always works for monitoring  
⚠️ **Test locally first** — Use `npm run dev` before enabling maintenance  

## Verify It Works

Test it right now:

```bash
# Enable maintenance
npm run maintenance:on

# Check status
npm run maintenance:status

# In another terminal, test API
curl http://localhost:3001/api/health
# Should see 503 response

# Disable maintenance
npm run maintenance:off

# Test again
curl http://localhost:3001/api/health
# Should see 200 response
```

## Need More Details?

- **Full workflow guide**: Read `MAINTENANCE_WORKFLOW.md`
- **Architecture overview**: Read `MAINTENANCE_MODE_GUIDE.md`
- **Code locations**:
  - Backend: `backend/src/middleware/maintenance.js`
  - Frontend: `frontend/components/MaintenancePage.tsx`
  - Config: `scripts/maintenance.js`
  - Data: `maintenance.json`

## Emergency Recovery

If the site won't come back up:

```bash
# This disables maintenance immediately
npm run maintenance:off

# Check what's happening
npm run maintenance:status

# If that fails, manually edit
cat maintenance.json
# Change "enabled": true to "enabled": false
```

---

**That's it!** You're ready to deploy with zero downtime. Happy coding! 🚀
