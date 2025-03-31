const { createLogger, format, transports } = require('winston');
const path = require('path');
const os = require('os');

const logFilePath = path.join('/app/logs/nodejs', 'nodejs-app.log');

// Custom formatter to include all relevant parameters
const apiLogFormat = format.printf(({ timestamp, level, message, ...metadata }) => {
  const { 
    ip, 
    method, 
    endpoint, 
    status, 
    responseTime, 
    requestSize, 
    responseSize,
    userAgent,
    // Additional fields
    authStatus,
    dbQueryTime,
    cpuUsage,
    memoryUsage
  } = metadata;

  return JSON.stringify({
    timestamp,
    level,
    server: os.hostname(),
    service: 'nodejs-api',
    // HTTP Request Metrics
    ip: ip || null,
    method: method || 'GET', // Default to GET if not specified
    endpoint: endpoint || '/',
    status: status || 200,
    response_time_ms: responseTime || 0,
    request_size_bytes: requestSize || 0,
    response_size_bytes: responseSize || 0,
    user_agent: userAgent || null,
    // Authentication/Security
    auth_status: authStatus || null,
    message
  });
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    apiLogFormat
  ),
  transports: [
    new transports.File({ 
      filename: logFilePath,
      maxsize: 1024 * 1024 * 10, // 10MB per file
      maxFiles: 5
    }),
    new transports.Console()
  ],
  exitOnError: false
});

// Helper method for API request logging
logger.logApiRequest = (req, res, responseTime, additionalData = {}) => {
  const logData = {
    ip: req.ip,
    method: req.method,
    endpoint: req.originalUrl,
    status: res.statusCode,
    responseTime,
    requestSize: req.headers['content-length'] || 0,
    responseSize: res.getHeader('Content-Length') || 0,
    userAgent: req.headers['user-agent'],
    ...additionalData
  };

  if (res.statusCode >= 500) {
    logger.error('Server error', logData);
  } else if (res.statusCode >= 400) {
    logger.warn('Client error', logData);
  } else {
    logger.info('API request', logData);
  }
};

// Example usage in middleware:
// app.use((req, res, next) => {
//   const start = Date.now();
//   res.on('finish', () => {
//     const responseTime = Date.now() - start;
//     logger.logApiRequest(req, res, responseTime, {
//       dbQueryTime: res.locals.dbQueryTime // If you track this
//     });
//   });
//   next();
// });

module.exports = logger;