#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAINTENANCE_FILE = path.join(__dirname, '..', 'maintenance.json');

const command = process.argv[2];

function readMaintenance() {
  try {
    if (fs.existsSync(MAINTENANCE_FILE)) {
      return JSON.parse(fs.readFileSync(MAINTENANCE_FILE, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading maintenance.json:', error.message);
  }
  return {
    enabled: false,
    reason: 'Site maintenance in progress',
    estimatedTime: '30 minutes',
    contact: 'support@autoshop.com'
  };
}

function writeMaintenance(data) {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(MAINTENANCE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing maintenance.json:', error.message);
    process.exit(1);
  }
}

function formatStatus(data) {
  return `
╔════════════════════════════════════════════════════════╗
║                 MAINTENANCE MODE STATUS                ║
╠════════════════════════════════════════════════════════╣
║ Status:        ${data.enabled ? '🔴 ACTIVE' : '🟢 INACTIVE'}
║ Reason:        ${data.reason}
║ Est. Time:     ${data.estimatedTime}
║ Contact:       ${data.contact}
║ Last Updated:  ${data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'N/A'}
╚════════════════════════════════════════════════════════╝
`;
}

switch (command) {
  case 'on':
  case 'enable': {
    const data = readMaintenance();
    data.enabled = true;
    writeMaintenance(data);
    console.log('\n✅ Maintenance mode ENABLED\n');
    console.log(formatStatus(data));
    console.log('⚠️  All API requests will return 503 Service Unavailable');
    console.log('ℹ️  Users will see the maintenance page\n');
    break;
  }

  case 'off':
  case 'disable': {
    const data = readMaintenance();
    data.enabled = false;
    writeMaintenance(data);
    console.log('\n✅ Maintenance mode DISABLED\n');
    console.log(formatStatus(data));
    console.log('ℹ️  Site is now back online\n');
    break;
  }

  case 'status': {
    const data = readMaintenance();
    console.log(formatStatus(data));
    break;
  }

  case 'set': {
    if (!process.argv[3] || !process.argv[4]) {
      console.error('Usage: npm run maintenance:set <key> <value>');
      console.error('Keys: reason, estimatedTime, contact');
      process.exit(1);
    }
    const key = process.argv[3];
    const value = process.argv.slice(4).join(' ');
    
    if (!['reason', 'estimatedTime', 'contact'].includes(key)) {
      console.error('Invalid key. Allowed keys: reason, estimatedTime, contact');
      process.exit(1);
    }

    const data = readMaintenance();
    data[key] = value;
    writeMaintenance(data);
    console.log(`\n✅ Updated ${key}: "${value}"\n`);
    console.log(formatStatus(data));
    break;
  }

  default:
    console.log(`
╔════════════════════════════════════════════════════════╗
║           AUTOSHOP MAINTENANCE MODE COMMANDS           ║
╠════════════════════════════════════════════════════════╣
║ Enable maintenance:  npm run maintenance:on            ║
║ Disable maintenance: npm run maintenance:off           ║
║ Check status:        npm run maintenance:status        ║
║ Set message:         npm run maintenance:set <key> ... ║
╠════════════════════════════════════════════════════════╣
║ Set Keys:                                              ║
║   reason          Main maintenance message             ║
║   estimatedTime   How long maintenance will take       ║
║   contact         Support email address                ║
╚════════════════════════════════════════════════════════╝
    `);
}
