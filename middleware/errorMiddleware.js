const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
      sendErrorForDev(err, res);
    } else {
      sendErrorForProd(err, res);
    }
  };
  
  const sendErrorForDev = (err, res) => {
    // handle JWT specific errors in dev mode
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please login again!',
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired. Please login again!',
      });
    }
  
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  };
  
  
const sendErrorForProd = (err, res) => {
    
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  };
  
  module.exports = globalError;