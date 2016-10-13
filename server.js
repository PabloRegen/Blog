'use strict';

const Promise = require('bluebird');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const rfr = require('rfr');
const scrypt = require('scrypt-for-humans');
const checkit = require('checkit');
const expressPromiseRouter = require('express-promise-router');
// const bhttp = require('bhttp');
// const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
// let upload = multer({ dest: 'uploads/' });

let config = require('./config.json');

let port = (process.env.PORT != null) ? process.env.PORT : config.listen.port;

let app = express();

let router = expressPromiseRouter();

/* if using router signup */
// const signup = require('./router/signup');
// app.use('/signup', signup);

/* Database setup */
// let environment = (process.env.NODE_ENV != null) ? process.env.NODE_ENV : 'development';
let knexfile = rfr('knexfile');
let knex = require('knex')(knexfile);

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public/images')));
app.use(express.static(path.join(__dirname, './public/styles')));


app.get('/', (req, res) => {
    res.render('./home');
});

app.get('/signup', (req, res) => {
    res.render('./forms/signup');
});

app.get('/signin', (req, res) => {
    res.render('./forms/signin');
});

app.get('/profile', (req, res) => {
    res.render('./forms/profile');
});

app.get('/post_create', (req, res) => {
    res.render('./post/create');
});

app.get('/post_edit', (req, res) => {
    res.render('./post/edit');
});

app.get('/post_read', (req, res) => {
    res.render('./post/read');
});


app.post('/signup', (req, res) => { // previously app.post
    console.log(req.body);
    console.log(req.body.username, req.body.email, req.body.password, req.body.confirm_password);

    return Promise.try(() => {
        return checkit({
            username: ['required', 'alphaDash', 'different:username'],
            email: ['required', 'email', function(val) {
                return knex('users').where('email', '=', val).then(function(resp) {
                    if (resp.length > 0) throw new Error('The email address is already in use.')
                })
            }],
            password: 'required',
            confirm_password: ['required', 'matchesField:password']
        }).run(req.body);
    }).then(() => {
        return scrypt.hash(req.body.password);
    }).then((hash) => {
        return knex('users').insert({
            username: req.body.username,
            email: req.body.email,
            pwHash: hash
        });
    }).then(() => {
        res.render('./land'); // res.redirect('/dashboard');
    });
});

app.post('/signin', (req, res) => {
    console.log(req.body);
    console.log(req.body.usernameOrEmail, req.body.password);

    return Promise.try(() => {
        return function() {
            let usernameOrEmailCheck = knex('users').where('username', req.body.usernameOrEmail).orWhere('email', req.body.usernameOrEmail);
            // check if username or email exist
            if (usernameOrEmailCheck.length === 0) {
                return 'The username or email does not exist';
            // check if password is correct for this username or email
            } else if (req.body.password !== usernameOrEmailCheck.select('psHash')) {
                return 'The password does not match the username or email';
            } else {
                // signin & display page after signin
            }
        };
    }).then(() => {
        res.send({usernameOrEmail: req.body.usernameOrEmail, pass: req.body.password});
    });
});

app.post('/profile', (req, res) => {
    console.log(req.body);
    console.log(req.body.name, req.body.bio, req.body.userPic);

    return Promise.try(() => {
        return knex('users').insert({
            name: req.body.name, 
            bio: req.body.bio, 
            userPic: req.body.userPic
        });
    }).then(() => {
        res.send({name: req.body.name, bio: req.body.bio, userPic: req.body.userPic});
    });
});

app.post('/post_create', (req, res) => {
    console.log(req.body);
    console.log(req.body.title, req.body.subtitle, req.body.body, req.body.postPic);

    return Promise.try(() => {
        return knex('posts').insert({
            title: req.body.title, 
            subtitle: req.body.subtitle, 
            body: req.body.body
        });
    }).then(() => {
        res.send({title: req.body.title, subtitle: req.body.subtitle, body: req.body.body, postPic: req.body.postPic});
    });
});


app.listen(port, () => {
    console.log('Server running at port ' + port);
});

/*
app.listen(config.listen.port, config.listen.host, function() {
        console.log("Listening...");
    });
*/