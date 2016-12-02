'use strict';

// const Promise = require('bluebird');
// const router = require('express-promise-router')();

module.exports = function() {  // is an argument needed?
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
                        res.redirect('/accounts/signin');
                    } else {
                        req.user = users[0];
                        next();
                    }
                });
            }
        });
    };
};