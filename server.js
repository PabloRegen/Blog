'use strict';

const Promise = require('bluebird');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const rfr = require('rfr');
// const bhttp = require('bhttp');
// const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
// let upload = multer({ dest: 'uploads/' });

/* Database setup */
// let environment = (process.env.NODE_ENV != null) ? process.env.NODE_ENV : 'development';
let knexfile = rfr('knexfile');
let knex = require('knex')(knexfile)


// // use checkit -> https://www.npmjs.com/package/checkit
// const signup_validator = require('./services/signup_validator.js');
// const profile_validator = require('./services/profile_validator.js');


let config = require('./config.json');

let app = express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public/images'))); // site picture
app.use(express.static(path.join(__dirname, './public/styles'))); // css files

// to be used later:
// var renderSomethingLater = function() {
//  return {
//      key: 'value', 
//  };
// };

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


app.post('/signup', (req, res) => {
	const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    console.log(req.body);
    console.log(username, email, password, confirm_password);

    var signup_validator = require('./lib/validators/signup.js');
    var signup_store = require('./lib/store/signup.js');

    Promise.try(function() {
        // validate data
        return function(username, email, password) {
            return signup_validator(username, email, password);
        }
        // store data
        .then(function(username, email, password) {
            return signup_store(username, email, password);
        })
        .then(function() {
            res.render('./land');
        })
        .catch((e) => console.error('Error!', e));
    })
});

app.post('/signin', (req, res) => {
    const usernameOrEmail = req.body.usernameOrEmail;
    const password = req.body.password;
    // const stay_signed = req.body.stay_signed;

    console.log(req.body);
    console.log(usernameOrEmail, password);

    var signin_validator = require('./lib/validators/signin.js');

    Promise.try(function() {
        return function(usernameOrEmail, password) {
            return signin_validator(usernameOrEmail, password);
        }
        .then(function() {
            res.send({usernameOrEmail: usernameOrEmail, pass: password});
        })
        .catch((e) => console.error('Error!', e));
    })

});

app.post('/profile', (req, res) => {
    const name = req.body.name;
    const bio = req.body.bio;
    const userPic = req.body.userPic;

    console.log(req.body);
    console.log(name, bio, userPic);

    var profile_validator = require('./lib/validators/profile.js');
    var profile_store = require('./lib/store/profile.js');

    Promise.try(function() {
        // validate data
        return function(name, bio, userPic) {
            return profile_validator(name, bio, userPic);
        }
        // store data
        .then(function(name, bio, userPic) {
            return profile_store(name, bio, userPic);
        })
        .then(function() {
            res.send({name: name, bio: bio, userPic: userPic});
        })
        .catch((e) => console.error('Error!', e));
    })

});

app.post('/post_create', (req, res) => {
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const body = req.body.body;
    const postPic = req.body.postPic;

    console.log(req.body);
    console.log(title, subtitle, body, postPic);

    // var postCreate = require('./lib/store/post_create.js');

    // Promise.try(function() {
    //     return function(title, subtitle, body, postPic) {
    //         return postCreate(title, subtitle, body, postPic);
    //     }
    //     .then(function() {
    //         res.send({title: title, subtitle: subtitle, body: body, postPic: postPic});
    //     })
    //     .catch((e) => console.error('Error!', e));
    // })

    Promise.try(function() {
        return function(title, subtitle, body, postPic) {
            return knex('posts').insert([{title: title}, {subtitle: subtitle}, {body: body}]);
        }
        .then(function() {
            res.send({title: title, subtitle: subtitle, body: body, postPic: postPic});
        })
        .catch((e) => console.error('Error!', e));
    })

});


let port = (process.env.PORT != null) ? process.env.PORT : config.listen.port;

app.listen(port, () => {
    console.log('Server running at port ' + port);
});

/*
app.listen(config.listen.port, config.listen.host, function() {
        console.log("Listening...");
    });
*/