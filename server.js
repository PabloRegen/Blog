const express = require('express');
let app = express();
const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
let upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');
const path = require('path');

const knex = require('knex')({
  client: 'pg',
  connection: {...},
  pool: {...},
  acquireConnectionTimeout: ...,
  migrations: {tableName: 'migrations'}
  searchPath: ...,
});


// // use checkit
// const signup_validator = require('./services/signup_validator.js');
// const profile_validator = require('./services/profile_validator.js');

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images'))); // site picture
app.use(express.static(path.join(__dirname, 'styles'))); // css files

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

    var signup_validator = require('./lib/validator/signup.js');
    var signup_store = require('./lib/store/signup.js');

    new.Promise(function(resolve, reject) {
        // validate data
        function(username, email, password) {
            return signup_validator(username, email, password);
        })
        // store data
        .then(function(username, email, password) {
            return signup_store(username, email, password);
        })
        .then(function() {
            res.render('./land');
        })
        .catch((e) => console.error(e));
    });
});

app.post('/signin', (req, res) => {
    const usernameOrEmail = req.body.usernameOrEmail;
    const password = req.body.password;
    // const stay_signed = req.body.stay_signed;

    console.log(req.body);
    console.log(usernameOrEmail, password);

    var signin_validator = require('./lib/validator/signin.js');

    new.Promise(function(resolve, reject) {
        // validate signin against signup data
        function(usernameOrEmail, password) {
            return signin_validator(usernameOrEmail, password);
        })
        .catch((e) => console.error(e));
    });

    res.send({usernameOrEmail: usernameOrEmail, pass: password, signed: stay_signed});
});

app.post('/profile', (req, res) => {
    const name = req.body.name;
    const bio = req.body.bio;
    const userPic = req.body.userPic;

    console.log(req.body);
    console.log(name, bio, userPic);

    var profile_validator = require('./lib/validator/profile.js');
    var profile_store = require('./lib/store/profile.js');

    new.Promise(function(resolve, reject) {
        // validate data
        function(name, bio, userPic) {
            return profile_validator(name, bio, userPic);
        })
        // store data
        .then(function(name, bio, userPic) {
            return profile_store(name, bio, userPic);
        })
        .catch((e) => console.error(e));
    });

    res.send({name: name, bio: bio, userPic: userPic});
});

app.post('/post_create', (req, res) => {
    const title = req.body.title;
    const header = req.body.header;
    const body = req.body.body;
    const postPic = req.body.postPic;

    console.log(req.body);
    console.log(title, header, body, postPic);

    res.send({title: title, header: header, body: body, postPic: postPic});
});

app.listen(8000, () => {
    console.log('Server running at port 8000');
});