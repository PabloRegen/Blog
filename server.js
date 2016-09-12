const express = require('express');
const app = express();
const signup_validator = require('./services/signup_validator.js');
const profile_validator = require('./services/profile_validator.js');
// or use npm install validator & var validator = require('validator');?

// var renderSomethingLater = function() {
// 	return {
// 		key: 'value', 
// 	};
// };

// app.set('views', __dirname + '/views'); // needed?
// or
// app.set('views', './views'); // needed?
// After the view engine is set, you don’t have to specify the engine or load the template engine module in your app; 
// Express loads the module internally
app.set('view engine', 'pug');
app.use('/images', express.static('./images'));
app.use(express.static('styles'));

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

app.get('/land_after_signup', function(req, res) {
    const username = req.query.username;
    const email = req.query.email;
    const password = req.query.password;
    const confirm_password = req.query.confirm_password;

    console.log(username, email, password, confirm_password);

    res.render('land_after_signup');
});

app.listen(8000);
console.log('Server running at localhost:8000')