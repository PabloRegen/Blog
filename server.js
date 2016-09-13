const express = require('express');
const app = express();

// use npm validator?
const signup_validator = require('./services/signup_validator.js');
const profile_validator = require('./services/profile_validator.js');

var signup_data_post = require('./services/signup_data_post.js');

// to be used later:
// var renderSomethingLater = function() {
// 	return {
// 		key: 'value', 
// 	};
// };


// After the view engine is set, no need to specify the engine or load the template engine module; Express does it internally
app.set('view engine', 'pug');
app.use('/images', express.static('./images'));
app.use(express.static('styles'));

// ES6: app.get('/', (req, res) => {
app.get('/', function(req, res) { 
    res.render('home');
});

app.get('/signup', function(req, res) {
    res.render('signup');
});

app.get('/signin', function(req, res) {
    res.render('signin');
});

app.get('/profile', function(req, res) {
    res.render('profile');
});

app.get('/create_blogpost', function(req, res) {
    res.render('create_blogpost');
});

app.get('/edit_blogpost', function(req, res) {
    res.render('edit_blogpost');
});

app.get('/read_blogpost', function(req, res) {
    res.render('read_blogpost');
});

// should be app.post instead?
app.get('/land_after_signup', function(req, res) {
    const username = req.query.username;
    const email = req.query.email;
    const password = req.query.password;
    const confirm_password = req.query.confirm_password;

    console.log(username, email, password, confirm_password);

    res.render('land_after_signup');
});


app.listen(8000, () => {
  console.log('Server running at port 8000');
});