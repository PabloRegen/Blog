const express = require('express');
const app = express();

var renderHome = function() {
	return {
		picHome: 'Picture here', 
    	textHome: 'Some text here', 
    	goSignup: 'go to sign up page',
    	goLogin: 'go to log in page',
	};
};

var renderSignup = function() {
	return {
    	email: 'email text input', 
    	username: 'username text input', 
    	password: 'password text input', 
    	terms: 'terms of service link',
    	createAccount: 'create account button',
    	goLogin: 'go to log in page button',
	};
};

var renderLogin = function() {
    return {
        email_username: 'username or email text input',  
        password: 'password text input', 
        staySigned: 'stay signed in checkbox',
        login: 'log in button',
        goSignup: 'go to sign up page',
        goLostPassword: 'go to lost password page link',
        goHome: 'return to homepage',
    };
};

var renderProfile = function() {
    return {
        firstName: 'first name text input',  
        lastName: 'last name text input', 
        bio: 'bio text input',
        userPic: 'picture upload',
    };
};

// app.set('views', __dirname + '/views'); // needed?
// or
// app.set('views', './views'); // needed?
// After the view engine is set, you don’t have to specify the engine or load the template engine module in your app; 
// Express loads the module internally
app.set('view engine', 'pug');

app.get('/', function(req, res) {
    res.render('home', renderHome());
});

app.get('/signup', function(req, res) {
    res.render('signup', renderSignup());
});

app.get('/login', function(req, res) {
    res.render('login', renderLogin());
});

app.get('/profile', function(req, res) {
    res.render('profile', renderProfile());
});

app.listen(8000);
console.log('Server running at localhost:8000')