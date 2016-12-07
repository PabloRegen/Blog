'use strict';

const Promise = require('bluebird');

module.exports = function(knex) {
    return function(req, res, next) {
        return Promise.try(() => {
            if (req.session.userId == null) {
                /* User is not logged in */
                res.redirect('/accounts/signin');
            } else {
                return Promise.try(() => {
                    return knex('users').where({ id: req.session.userId });
                }).then((users) => {
                    if (users.length === 0) {
                        /* User no longer exists */
                        req.session.destroy();
                        res.redirect('/accounts/signup');
                    } else {
                        req.user = users[0];
                        next();
                    }
                });
            }
        });
    };
};