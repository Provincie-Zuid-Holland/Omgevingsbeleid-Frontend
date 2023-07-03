// Import and initialize Sentry for tracking bugs
if (process.env.VITE_SENTRY_DSN && process.env.NODE_ENV !== 'development') {
    const Sentry = require('@sentry/browser')

    Sentry.init({
        environment: process.env.NODE_ENV,
        release: process.env.VITE_RELEASE_VERSION,
        dsn: process.env.VITE_SENTRY_DSN,
    })
}
