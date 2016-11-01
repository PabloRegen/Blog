'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const knexfile = require('./knexfile');
const config = require('./config.json');
const util = require('util');

let port = (config.listen.port != null) ? config.listen.port : 8000

/* Database setup */
// let environment = (process.env.NODE_ENV != null) ? process.env.NODE_ENV : 'development';
let knex = require('knex')(knexfile);

let app = express();
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

/* Route setup */
app.use('/', require('./routes/home'));
app.use('/accounts', require('./routes/accounts')(knex));
app.use('/posts', require('./routes/posts')(knex));

app.use((err, req, res, next) => {
  console.log(util.inspect(err, {depth: null, showHidden: true}));
  res.send("error");
});

app.listen(config.listen.port, () => {
    console.log('Server running at port ' + config.listen.port);
});

/* error handling */
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });
// // or ???
// app.use((err, req, res, next) => {
//     let statusCode = (err.status !== null ? err.status : 500);
//     res.status(statusCode).send(err.message);
// });