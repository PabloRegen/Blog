// VERSION 1
'use strict';

// console.log("--> verify-membership-or-own: run by const verifyMembershipOrOwn = rfr('middleware/verify-membership-or-own')");

/* verify if user owns the post or has enough capabilities */
module.exports = function(req, res, next) {
	// console.log('--> verify-membership-or-own: run for every request');

	let membership = req.user.membership;

	if (post.userId === req.user.id) {
		/* user owns post */
		next();
	} else {
		if (membership === 'owner' || membership === 'admin' || membership === 'moderator') {
			/* user has enough capabilities */
			next();
		} else {
			res.redirect(`/posts/${post.id}/read`);
		}
	}
};


// VERSION 2
'use strict';

const Promise = require('bluebird');

module.exports = function(knex) {
	return function(req, res, next) {
		let membership = req.user.membership;

		if (membership === 'owner' || membership === 'admin' || membership === 'moderator') {
			/* user has enough capabilities */
			next();
		} else {
			return promise.try(() => {
				return knex('posts').where({ id === req.params.id }) // do I have access to req.params.id?
			}).then((post) => {
				if (post[0].userId === req.user.id) {
					/* user owns post */
					next();
				} else {
					res.redirect(`/posts/${post[0].id}/read`);
				}
			});
		}
	};
};

