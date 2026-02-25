import logger from '../utils/logger.js';
import { env } from '../config/env.js';

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  // Log error detailed for debugging
  logger.error(`${req.method} ${req.url} - ${status} - ${message}`, {
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    details: err.details
  });

  res.status(status).json({
    success: false,
    message,
    code,
    details: err.details || undefined,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;
