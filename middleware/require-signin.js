'use strict';

console.log("--> require-signin: run by const requireSignin = rfr('middleware/require-signin')");

/* Redirect to sign in ONLY if user is not signed in */
module.exports = function(req, res, next) {
    console.log('--> require-signin: run for every request');
    if (req.user == null) {
        res.redirect('/accounts/signin');
    } else {
        next();
    }
};