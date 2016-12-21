'use strict';

console.log("--> errors.js: run by const errors = rfr('lib/errors')");

const createError = require('create-error');

let HttpError = createError('HttpError');

let httpErrorTypes = {
	400: 'BadRequestError',
	401: 'UnauthorizedError',
	403: 'ForbiddenError',
	404: 'NotFoundError',
	405: 'MethodNotAllowedError',
	409: 'ConflictError',
	422: 'ValidationError' // Actually, 'Unprocessable entity'
};

let errors = {};
// ie: 'BadRequestError': createError(HttpError, 'BadRequestError', { statusCode: 400 });

Object.keys(httpErrorTypes).forEach((code) => {
	let errorName = httpErrorTypes[code];
	let errorProperties = {
		statusCode: parseInt(code)
	};
	
	errors[errorName] = createError(HttpError, errorName, errorProperties);
});

module.exports = errors;