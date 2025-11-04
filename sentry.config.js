/**
 * Sentry Configuration for Build-time
 * يُستخدم لرفع source maps إلى Sentry
 */

module.exports = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Auth token for uploading source maps
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppress all logs (https://github.com/getsentry/sentry-webpack-plugin#options)
  silent: false,

  // Upload source maps for production builds
  include: [
    './packages/cli/dist',
    './packages/desktop/dist',
    './packages/cloud-editor/dist',
  ],

  // Ignore certain files
  ignore: ['node_modules', 'webpack.config.js'],

  // Set release name
  release: process.env.npm_package_version,

  // Deploy environment
  deploy: {
    env: process.env.NODE_ENV || 'production',
  },
};
