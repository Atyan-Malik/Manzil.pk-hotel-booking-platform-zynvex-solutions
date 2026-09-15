// middleware/errorMiddleware.js

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;

  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.statusCode ||
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    status: err.status || (statusCode >= 400 && statusCode < 500 ? "fail" : "error"),
    message: err.message || "Server error",

    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};