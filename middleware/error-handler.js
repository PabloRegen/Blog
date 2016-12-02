'use strict';

module.exports = function(environment) {	
	return function(err, req, res, next) {
		if (environment === 'development') {
			console.log("--- error-handler.js: err.name       --- ", err.name);
			console.log("--- error-handler.js: err.message    --- ", err.message);			
			console.log("--- error-handler.js: err.statusCode --- ", err.statusCode);
			console.log("--- error-handler.js: err 	     --- ", err);
		}

		if (err.statusCode != null && typeof err.statusCode === 'number') {
			res.status(err.statusCode);

			/* We only want to send the message for client errors - for any other errors, it likely contains internal information. */
			if ((err.statusCode >= 400 && err.statusCode < 500) || environment === 'development') {
				let errorResponse = {
					name: err.name,
					message: err.message,
					statusCode: err.statusCode,
					err: err
				};

				// res.send(errorResponse);
				res.send(err)
				// res.send(err.message)

			} else {
				res.send(http.STATUS_CODES[err.statusCode]);
			}
		} else {
			if (environment === 'development') {
				res.status(500).send(err);
			} else {
				res.status(500).send('An unknown error occurred.');
			}
		}
	};
};