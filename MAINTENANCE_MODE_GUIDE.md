# Maintenance Mode Guide

## Overview
The maintenance mode system allows you to quickly put your site into maintenance without deploying. This is useful for database migrations, critical updates, or structural changes.

## Quick Start

### Enable Maintenance Mode
```bash
npm run maintenance:on
```

### Disable Maintenance Mode
```bash
npm run maintenance:off
```

### Check Status
```bash
npm run maintenance:status
```

## How It Works

1. **Flag File**: A JSON file (`maintenance.json`) in the root controls the state
2. **Backend Middleware**: Express middleware checks this file on startup and periodically
3. **Maintenance Page**: Users see a beautiful holding page when maintenance is active
4. **No Redeployment**: Changes take effect immediately without redeploying

## Process for Making Changes

1. **Prepare locally**: Make and test all changes locally with `npm run dev`
2. **Enable maintenance**: Run `npm run maintenance:on` on production
3. **Make changes**: Deploy your code changes (database migrations, etc.)
4. **Disable maintenance**: Run `npm run maintenance:off`
5. **Verify**: Check that everything works as expected

## Files Involved

- `maintenance.json` - The control flag (not in git)
- `backend/src/middleware/maintenance.ts` - Backend middleware
- `frontend/components/MaintenancePage.tsx` - Frontend page component
- `scripts/maintenance.js` - CLI script for toggling

## Notes

- The maintenance flag is checked automatically on backend startup
- The frontend will receive appropriate responses when maintenance is active
- All API requests return 503 Service Unavailable when maintenance is active
- The maintenance page is static and works even during database issues
