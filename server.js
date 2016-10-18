'use strict';

const Promise = require('bluebird');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const rfr = require('rfr');
const scrypt = require('scrypt-for-humans');
const checkit = require('checkit');
const expressPromiseRouter = require('express-promise-router');
// const bhttp = require('bhttp');
// const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
// let upload = multer({ dest: 'uploads/' });

let config = require('./config.json');

let app = express();

let router = expressPromiseRouter();

/* Database setup */
// let environment = (process.env.NODE_ENV != null) ? process.env.NODE_ENV : 'development';
let knexfile = require('./knexfile');
let knex = require('knex')(knexfile);

let home = require('./routes/home');
let signup = require('./routes/users/signup')(knex);
let signin = require('./routes/users/signin')(knex);
let profile = require('./routes/users/signup')(knex);
let create = require('./routes/posts/signup')(knex);
let edit = require('./routes/posts/edit')(knex);
let read = require('./routes/posts/read')(knex);

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './public/images')));
app.use(express.static(path.join(__dirname, './public/styles')));

/* Route setup */
app.use('/home', home);
app.use('/signup', signup);
app.use('/signin', signin);
app.use('/profile', profile);
app.use('/post_create', create);
app.use('/post_edit', edit);
app.use('/post_read', read);

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

let port = (process.env.PORT != null) ? process.env.PORT : config.listen.port;

app.listen(port, () => {
    console.log('Server running at port ' + port);
});

/*
app.listen(config.listen.port, config.listen.host, function() {
        console.log("Listening...");
    });
*/