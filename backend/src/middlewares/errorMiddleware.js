const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  let statusCode =
    error.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = error.message || "Server error";

  if (error.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
