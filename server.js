'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rfr = require('rfr');
// const util = require('util');

const errorHandler = rfr('middleware/error-handler');
const errors = rfr('lib/errors');

let config = require('./config.json');

/* Database setup */
let environment = (process.env.NODE_ENV != null) ? process.env.NODE_ENV : 'development';
let knex = require('knex')(require('./knexfile'));

let app = express();

/* Express configuration */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

/* Route setup */
app.use('/', require('./routes/home'));
app.use('/accounts', require('./routes/accounts')(knex));
app.use('/posts', require('./routes/posts')(knex));
 
/* Default 404 handler */
app.use((req, res, next) => {
	next(new errors.NotFoundError('--- Im server.js L33 - Page not found ---'));
	// next(new Error('--- Im server.js L33 - Page not found ---'));
});

/* error handling */
app.use(errorHandler(environment));

// app.use((err, req, res, next) => {
//   console.log(util.inspect(err, {depth: null, showHidden: true}));
//   res.send('error');
// });

app.listen(config.listen.port, () => {
    console.log('Server running at port ' + config.listen.port);
});