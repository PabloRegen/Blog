'use strict';

// const Promise = require('bluebird');
const path = require('path');
const express = require('express');
// const bodyParser = require('body-parser');
// const rfr = require('rfr');
// const scrypt = require('scrypt-for-humans');
// const checkit = require('checkit');
const expressPromiseRouter = require('express-promise-router');
// const bhttp = require('bhttp');
// const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
// let upload = multer({ dest: 'uploads/' });

let config = require('./config.json');

let app = express();

let router = expressPromiseRouter();

app.set('view engine', 'pug');

// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, './public')));

/* Database setup */
// let environment = (process.env.NODE_ENV != null) ? process.env.NODE_ENV : 'development';
let knexfile = require('./knexfile');
let knex = require('knex')(knexfile);

/* Route setup */
// app.get('/', (req, res) => {
// 	res.render('./home');
// });
app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts')(knex));
app.use('/accounts', require('./routes/accounts')(knex));

let port = (process.env.PORT != null) ? process.env.PORT : config.listen.port;
app.listen(port, () => {
    console.log('Server running at port ' + port);
});

/*
app.listen(config.listen.port, config.listen.host, function() {
        console.log("Listening...");
    });
*/

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