import response from '../utils/response.js';
import { ClientError, InvariantError, NotFoundError } from '../exceptions/index.js';

const ErrorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return response(res, err.statusCode, err.message, null);
  }

  if (err instanceof InvariantError) {
    return response(res, err.statusCode, err.message, null);
  }

  if (err instanceof NotFoundError) {
    return response(res, err.statusCode, err.message, null);
  }

  // Handle Joi validation errors
  if (err.isJoi) {
    return response(res, 400, err.details[0].message, null);
  }

  // Handle PostgreSQL errors
  if (err.code) {
    switch (err.code) {
    case '23505': // Unique violation
      return response(res, 409, 'Data already exists', null);
    case '23503': // Foreign key violation
      return response(res, 400, 'Referenced data does not exist', null);
    case '23502': // Not null violation
      return response(res, 400, 'Required field is missing', null);
    case '22P02': // Invalid input syntax
      return response(res, 400, 'Invalid data format', null);
    default:
      return response(res, 500, 'Database error occurred', null);
    }
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Unhandled error:', err);

  return response(res, status, message, null);
};

export default ErrorHandler;