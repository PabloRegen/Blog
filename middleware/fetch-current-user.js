'use strict';

console.log("--> fetch-current-user.js: const fetchCurrentUser = rfr('middleware/fetch-current-user')");

const Promise = require('bluebird');

module.exports = function(knex) {
    console.log("--> fetch-current-user.js: app.use(fetchCurrentUser(knex))");

    return function(req, res, next) {
        console.log('--> fetch-current-user.js: run for every request');
        
        if (req.session.userId == null) {
        	/* User is not logged in */
            next();
        } else {
            return Promise.try(() => {
            	/* hard delete case. Change to soft delete? chat#19Q3 */
                return knex('users').where({ id: req.session.userId });
            }).then((users) => {
                if (users.length === 0) {
                    /* User no longer exists */
                    /* therefore log user out */
                    req.session.destroy();
                    res.redirect('/accounts/signup');
                } else {
                	/* set user on req object */
                	/* for application-wide availability */
                    req.user = users[0];
                    next();
                }
            });
        }
    };
};