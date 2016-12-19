'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rfr = require('rfr');
const favicon = require('serve-favicon');
const expressSession = require('express-session');
const KnexSessionStore = require('connect-session-knex')(expressSession);

// const sessionHandler = rfr('middleware/session-handler')  // Will deal with removed users in the session handling middleware
const errorHandler = rfr('middleware/error-handler');
const errors = rfr('lib/errors');

let config = require('./config.json');

/* Database setup */
let environment = (process.env.NODE_ENV != null) ? process.env.NODE_ENV : 'development';
let knex = require('knex')(require('./knexfile'));

let app = express();

/* Express configuration */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname + '/public/images/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

/* Session setup */
/* create a new express-session middleware and app.use it */
/* so that it processes every request, attaching session data where needed */
app.use(expressSession({
	secret: config.sessions.secret,
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	store: new KnexSessionStore({
		knex: knex
	}),	
	cookie: {
		maxAge: (config.sessions.cookieExpiry) // currently 24hs
	}
}));

// app.use(sessionHandler(???)); // Goes here?

/* Fetch current user */
/* from the db and set it on req object */
/* so it's available application-wide for every new request */
app.use(rfr('middleware/fetch-current-user')(knex));

/* Set user as request-wide locals */
/* to make the user object available in every res.render for all requests */
app.use(function(req, res, next) {
	console.log('--> Set user as request-wide locals. req.user = ' + req.user);
    res.locals.user = req.user;
    next();
});

/* Route setup */
app.use('/', require('./routes/home'));
app.use('/accounts', require('./routes/accounts')(knex));
app.use('/posts', require('./routes/posts')(knex));

/* Default 404 handler */
app.use(function(req, res, next) {
	next(new errors.NotFoundError('--- server.js: Page not found. ---'));
});

/* error handling */
app.use(errorHandler(environment));

app.listen(config.listen.port, () => {
    console.log('Server running at port ' + config.listen.port);
});