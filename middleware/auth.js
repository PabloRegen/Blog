'use strict';

const Promise = require('bluebird');

module.exports = function(knex, requiredRole) {
	return function(req, res, next) {
		if (req.user.role >= requiredRole) {
			/* user has enough permission */
			next();
		} else {
			return Promise.try(() => {
				return knex('posts').where({id: req.params.id});
			}).then((posts) => {
				if (req.user.id === posts[0].userId) {
					/* user owns the post */
					next();
				} else {
					next(new errors.UnauthorizedError('You do not have the required permissions to access this page'));
				}
			});
		}
	};
};