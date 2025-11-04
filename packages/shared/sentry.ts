/**
 * Sentry Error Monitoring Setup
 * تكوين موحد لمراقبة الأخطاء عبر جميع الحزم
 */

import * as Sentry from '@sentry/node';

interface SentryConfig {
  dsn?: string;
  environment: string;
  release?: string;
  tracesSampleRate?: number;
  debug?: boolean;
}

export function initSentry(config: SentryConfig) {
  if (!config.dsn) {
    console.warn('⚠️  Sentry DSN not configured - error monitoring disabled');
    return;
  }

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    release: config.release,
    tracesSampleRate: config.tracesSampleRate ?? 0.1,
    debug: config.debug ?? false,

    // Performance monitoring
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Console(),
      new Sentry.Integrations.FunctionToString(),
    ],

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }

      // Remove API keys from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
          if (breadcrumb.data) {
            const sanitized = { ...breadcrumb.data };
            Object.keys(sanitized).forEach(key => {
              if (key.toLowerCase().includes('key') || key.toLowerCase().includes('token')) {
                sanitized[key] = '[REDACTED]';
              }
            });
            return { ...breadcrumb, data: sanitized };
          }
          return breadcrumb;
        });
      }

      return event;
    },
  });

  console.log('✅ Sentry initialized');
}

export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

export function setUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}) {
  Sentry.addBreadcrumb(breadcrumb);
}

export { Sentry };
