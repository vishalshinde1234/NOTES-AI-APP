const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 11000) { status = 409; message = 'Email already exists.'; }
  if (err.name === 'ValidationError') { status = 422; message = Object.values(err.errors).map(e => e.message).join(' '); }
  if (err.name === 'CastError') { status = 400; message = 'Invalid ID format.'; }

  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;