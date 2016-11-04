'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config.json');
const util = require('util');
// const errors = require('errors');

let port = (config.listen.port != null) ? config.listen.port : 8000

/* Database setup */
// let environment = (process.env.NODE_ENV != null) ? process.env.NODE_ENV : 'development';
let knex = require('knex')(require('./knexfile'));

let app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

/* Route setup */
app.use('/', require('./routes/home'));
app.use('/accounts', require('./routes/accounts')(knex));
app.use('/posts', require('./routes/posts')(knex));

/* error handling */
app.use((err, req, res, next) => {
  console.log(util.inspect(err, {depth: null, showHidden: true}));
  res.send("error");
});

// app.use((err, req, res, next) => {
//     let statusCode = err.status !== null ? err.status : 500;
//     res.status(statusCode).send(err.message);
// });

// How do I setup an error handler? http://expressjs.com/en/guide/error-handling.html
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// How do I handle 404 responses? http://expressjs.com/en/starter/faq.html
// app.use(function (req, res, next) {
//   res.status(404).send('Sorry cant find that!')
// })

app.listen(config.listen.port, () => {
    console.log('Server running at port ' + config.listen.port);
});