const express = require('express');
const bodyParser = require('body-parser')

const app = express();

// use npm validator package instead
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
app.use('/images', express.static(__dirname + '/images')); // site picture
app.use(express.static(__dirname + '/styles')); // css files

// not needed unless views folder is named other than its default 'views' name (eg. 'hello') 
// app.set('views', __dirname + '/hello');

// ES6: app.get('/', (req, res) => {
app.get('/', function(req, res) {
    res.render('./home');
});

app.get('/signup', function(req, res) {
    res.render('./forms/signup');
});

app.get('/signin', function(req, res) {
    res.render('./forms/signin');
});

app.get('/profile', function(req, res) {
    res.render('./forms/profile');
});

app.get('/post_create', function(req, res) {
    res.render('./post/create');
});

app.get('/post_edit', function(req, res) {
    res.render('./post/edit');
});

app.get('/post_read', function(req, res) {
    res.render('./post/read');
});


// send as a POST request, use body-parser, and get the values from req.body
app.post('/signup', function(req, res) {
    // const username = req.query.username;
    // const email = req.query.email;
    // const password = req.query.password;
    // const confirm_password = req.query.confirm_password;
    // console.log(username, email, password, confirm_password);

    res.render('./land');
});


app.listen(8000, () => {
  console.log('Server running at port 8000');
});