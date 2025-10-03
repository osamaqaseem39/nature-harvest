/**
 * Utility function to handle MongoDB errors and return user-friendly messages
 * @param {Error} error - The error object from MongoDB/Mongoose
 * @param {string} defaultMessage - Default error message if no specific handling
 * @returns {Object} - Object containing errorMessage and statusCode
 */
function handleMongoError(error, defaultMessage = 'An error occurred') {
  let errorMessage = defaultMessage;
  let statusCode = 400;
  
  // Handle specific MongoDB errors
  if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyPattern || {})[0];
    if (field === 'name') {
      errorMessage = `A record with this name already exists. Please choose a different name.`;
    } else if (field === 'slug') {
      errorMessage = `A record with this slug already exists. Please try again.`;
    } else if (field === 'email') {
      errorMessage = `A user with this email already exists. Please use a different email.`;
    } else if (field) {
      errorMessage = `A record with this ${field} already exists. Please choose a different ${field}.`;
    } else {
      errorMessage = 'A record with these details already exists. Please check your input and try again.';
    }
    statusCode = 409; // Conflict
  } else if (error.name === 'ValidationError') {
    // Mongoose validation error
    const validationErrors = Object.values(error.errors).map(err => err.message);
    errorMessage = `Validation failed: ${validationErrors.join(', ')}`;
    statusCode = 400;
  } else if (error.name === 'CastError') {
    // Invalid ObjectId or type casting error
    errorMessage = `Invalid ${error.path}: ${error.value}`;
    statusCode = 400;
  } else if (error.name === 'MongoServerError') {
    // General MongoDB server error
    if (error.code === 11000) {
      // Duplicate key error (alternative code)
      const field = Object.keys(error.keyPattern || {})[0];
      errorMessage = `A record with this ${field} already exists. Please choose a different ${field}.`;
      statusCode = 409;
    } else {
      errorMessage = 'Database error occurred. Please try again.';
      statusCode = 500;
    }
  }
  
  return {
    errorMessage,
    statusCode,
    errorDetails: process.env.NODE_ENV === 'development' ? {
      code: error.code,
      name: error.name,
      message: error.message,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue,
      stack: error.stack
    } : {}
  };
}

/**
 * Send a standardized error response
 * @param {Object} res - Express response object
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message
 * @param {number} defaultStatusCode - Default status code
 */
function sendErrorResponse(res, error, defaultMessage = 'An error occurred', defaultStatusCode = 400) {
  const { errorMessage, statusCode, errorDetails } = handleMongoError(error, defaultMessage);
  
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: errorDetails
  });
}

module.exports = {
  handleMongoError,
  sendErrorResponse
};
