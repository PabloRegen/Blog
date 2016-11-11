'use strict';

module.exports = function(environment) {	
	return function(err, req, res, next) {
		if (environment === 'development') {
			console.log("--- I'm error-handler.js L6: err.status --- ", err.status);
			console.log("--- I'm error-handler.js L7: err.statusCode --- ", err.statusCode);
			console.log("--- I'm error-handler.js L8: err.message --- ", err.message);
			console.log("--- I'm error-handler.js L9: err --- ", err);
		}

		if (err.statusCode != null && typeof err.statusCode === 'number') {
			res.status(err.statusCode);

			/* We only want to send the message for client errors - for any other errors, it likely contains internal information. */
			if ((err.statusCode >= 400 && err.statusCode < 500) || environment === 'development') {
				let errorResponse = {
					message: err.message
				};

				// if (err.publicFields != null) {
				// 	err.publicFields.forEach((field) => {
				// 		errorResponse[field] = err[field];
				// 	})
				// }

				res.send(errorResponse);
			} else {
				res.send({
					message: http.STATUS_CODES[err.statusCode] // error short description
				});
			}
		} else {
			if (environment === 'development') {
				res.status(500).send({
					message: err.message
				});
			} else {
				res.status(500).send({
					message: 'An unknown error occurred.'
				});
			} 
			
		}
	}
}