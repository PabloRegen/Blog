'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const knexfile = require('./knexfile');
const config = require('./config.json');

let app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* Database setup */
// let environment = (process.env.NODE_ENV != null) ? process.env.NODE_ENV : 'development';
let knex = require('knex')(knexfile);

/* Route setup */
app.use('/', require('./routes/home'));
app.use('/accounts', require('./routes/accounts')(knex));
app.use('/posts', require('./routes/posts')(knex));

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