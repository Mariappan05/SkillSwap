const errorHandler = (err, req, res, next) => {
    const error = {
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    };

    // MongoDB duplicate key error
    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    // Validation error
    if (err.name === 'ValidationError') {
        error.message = Object.values(err.errors).map(val => val.message);
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json(error);
};

module.exports = errorHandler;
