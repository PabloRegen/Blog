'use strict';

/* Redirect to sign in ONLY if user is not logged in */
module.exports = function(req, res, next) {
    console.log('--> require-signin');
    if (req.user == null) {
        res.redirect('/accounts/signin');
    } else {
        next();
    }
};