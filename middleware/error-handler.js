'use strict';

module.exports = function(environment) {	
	return function(err, req, res, next) {
		if (environment === 'development') {
			console.log("--- I'm error-handler.js L6: err.name --- ", err.name);
			console.log("--- I'm error-handler.js L7: err.statusCode --- ", err.statusCode);
			console.log("--- I'm error-handler.js L8: err.message --- ", err.message);
			console.log("--- I'm error-handler.js L9: err --- ", err);
		}

		if (err.statusCode != null && typeof err.statusCode === 'number') {
			res.status(err.statusCode);

			/* We only want to send the message for client errors - for any other errors, it likely contains internal information. */
			(err.statusCode >= 400 && err.statusCode < 500) || environment === 'development' ? res.send(err.message) : res.send(http.STATUS_CODES[err.statusCode]);
		} else {
			environment === 'development' ? res.status(500).send(err.message) : res.status(500).send('An unknown error occurred.');
		}
	};
};