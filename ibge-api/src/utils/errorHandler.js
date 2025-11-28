class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleError = (error, res) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      error: error.message,
      status: 'error'
    });
  }

  console.error('Erro não operacional:', error);
  return res.status(500).json({
    error: 'Erro interno do servidor',
    message: error.message
  });
};

module.exports = {
  AppError,
  handleError
};
