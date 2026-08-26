const AppError = require("../utils/AppError");

const handleCastError = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists. Please use a different value.`, 400);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  return new AppError(messages.join(". "), 400);
};

const handleJWTError = () => new AppError("Invalid session. Please log in again.", 401);
const handleJWTExpiredError = () => new AppError("Your session has expired. Please log in again.", 401);

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err, message: err.message };

  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateFieldsError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Something went wrong",
  });
};

module.exports = errorHandler;
