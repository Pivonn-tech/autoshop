import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAINTENANCE_FILE = path.join(__dirname, '../../..', 'maintenance.json');

let maintenanceState = {
  enabled: false,
  reason: 'Site maintenance in progress',
  estimatedTime: '30 minutes',
  contact: 'support@autoshop.com'
};

// Load maintenance state from file
function loadMaintenanceState() {
  try {
    if (fs.existsSync(MAINTENANCE_FILE)) {
      const data = fs.readFileSync(MAINTENANCE_FILE, 'utf-8');
      maintenanceState = JSON.parse(data);
    }
  } catch (error) {
    console.warn('Error reading maintenance.json:', error.message);
  }
}

// Initial load
loadMaintenanceState();

// Reload maintenance state periodically (every 5 seconds)
setInterval(loadMaintenanceState, 5000);

/**
 * Maintenance mode middleware for Express
 * Returns 503 Service Unavailable when maintenance is active
 */
export const maintenanceMiddleware = (req, res, next) => {
  // Always reload to catch file changes
  loadMaintenanceState();

  // Skip health check endpoints
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  if (maintenanceState.enabled) {
    return res.status(503).json({
      status: 'maintenance',
      message: 'We are currently under maintenance. Please try again later.',
      reason: maintenanceState.reason,
      estimatedTime: maintenanceState.estimatedTime,
      contact: maintenanceState.contact
    });
  }

  next();
};

/**
 * Get current maintenance state
 */
export const getMaintenanceState = () => {
  loadMaintenanceState();
  return maintenanceState;
};
