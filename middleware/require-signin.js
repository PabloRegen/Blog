'use strict';

console.log("--> require-signin: run by const requireSignin = rfr('middleware/require-signin')");

/* Checks whether the user is logged in (req.user was set or not) */
/* for the routes that are only for logged-in users */
/* Redirect to sign in ONLY if user is not signed in */
module.exports = function(req, res, next) {
    console.log('--> require-signin: run for every request');
    if (req.user == null) {
    	/* User is not logged in */
        /* (fetchCurrentUser sets req.user for every request) */
        res.redirect('/accounts/signin');
    } else {
        next();
    }
};