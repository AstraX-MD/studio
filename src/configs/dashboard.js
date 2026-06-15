/**
 * @fileOverview Configuration for the web-based management console.
 */
export default {
  enabled: true,
  port: process.env.PORT || 9002,
  auth: {
    secret: process.env.DASHBOARD_SECRET || 'astrax-dev-secret-key',
    sessionTimeout: 3600000 // 1 hour
  },
  telemetry: {
    ramThreshold: 75, // percentage
    logRetention: 100 // max logs to keep in memory
  }
};
