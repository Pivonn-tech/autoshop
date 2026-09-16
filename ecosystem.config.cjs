/**
 * PM2 ecosystem config — run with:
 *   npm install -g pm2
 *   pm2 start ecosystem.config.cjs
 *   pm2 save && pm2 startup   (to auto-start on reboot)
 *
 * Useful commands:
 *   pm2 status
 *   pm2 logs autoshop-api
 *   pm2 logs autoshop-frontend
 *   pm2 restart all
 *   pm2 reload all    (zero-downtime reload)
 */

module.exports = {
  apps: [
    // ── Express API ────────────────────────────────────────────────────────
    {
      name: "autoshop-api",
      cwd: "./backend",
      script: "src/index.js",
      interpreter: "node",
      // Run migrate before starting on first launch
      pre_exit: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3001,
      },
      // Auto-restart on crash; back off exponentially
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,
      exp_backoff_restart_delay: 100,
      // Memory limit: restart if over 512 MB
      max_memory_restart: "512M",
      // Logging
      out_file: ".logs/api.out.log",
      error_file: ".logs/api.err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },

    // ── Next.js Frontend ───────────────────────────────────────────────────
    {
      name: "autoshop-frontend",
      cwd: "./frontend",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,
      exp_backoff_restart_delay: 100,
      max_memory_restart: "1G",
      out_file: ".logs/frontend.out.log",
      error_file: ".logs/frontend.err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
