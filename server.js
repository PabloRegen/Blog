'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rfr = require('rfr');
const expressSession = require('express-session');
const KnexSessionStore = require('connect-session-knex')(expressSession);
// const Firebase = require('firebase');
// const FirebaseTokenGenerator = require('firebase-token-generator');
// const cors = require('cors');
// const stripe = require('stripe');

// const sessionHandler = rfr('middleware/session-handler')  // Will deal with removed users in the session handling middleware
const errorHandler = rfr('middleware/error-handler');
const errors = rfr('lib/errors');

let config = require('./config.json');

/* Database setup */
let environment = (process.env.NODE_ENV != null) ? process.env.NODE_ENV : 'development';
let knexfile = require('./knexfile');
let knex = require('knex')(knexfile);

let app = express();

/* Session setup */
app.use(expressSession({
	store: new KnexSessionStore({
		knex: knex
	}),
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: config.sessions.secret,
	cookie: {
		// expires: Date.now() + (config.sessions.cookieExpiry * 1000),
		maxAge: (config.sessions.cookieExpiry * 1000)
	}
}));

/* Express configuration */
// app.disable('etag');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(sessionHandler(???)); // Goes here?

/* Route setup */
app.use('/', require('./routes/home'));
app.use('/accounts', require('./routes/accounts')(knex));
app.use('/posts', require('./routes/posts')(knex));
 
/* Default 404 handler */
app.use((req, res, next) => {
	next(new errors.NotFoundError('--- server.js: Page not found. ---'));
});

/* error handling */
app.use(errorHandler(environment));

app.listen(config.listen.port, () => {
    console.log('Server running at port ' + config.listen.port);
});