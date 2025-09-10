const httpStatus = require('http-status');

function errorHandler(err, req, res, next) {
	const status = err.status || err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
	const response = {
		success: false,
		message: err.message || 'Internal Server Error',
	};
	if (process.env.NODE_ENV !== 'production' && err.stack) {
		response.stack = err.stack;
	}
	res.status(status).json(response);
}

module.exports = errorHandler;


