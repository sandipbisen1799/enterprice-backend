import { STATUS_CODES, MESSAGES } from "../constants/status.js";

export const errorMiddleware = (err, req, res, next) => {
  console.error('Error middleware:', err);

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(STATUS_CODES.CONFLICT).json({
      success: false,
      message: MESSAGES.USER_EXISTS,
    });
  }

  // Handle operational errors
  if (err.isOperational) {
    return res.status(err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }

  // Generic fallback
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: MESSAGES.SERVER_ERROR,
  });
};
