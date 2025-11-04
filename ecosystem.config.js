/**
 * PM2 Process Manager Configuration
 * للتشغيل: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      name: 'oqool-cli',
      script: 'packages/cli/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'oqool-desktop',
      script: 'packages/desktop/dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'oqool-cloud',
      script: 'packages/cloud-editor/dist/server.js',
      instances: 'max', // استخدام جميع الأنوية المتاحة
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
    },
  ],
};
