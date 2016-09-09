const express = require('express');
const app = express();

var renderSomethingLater = function() {
	return {
		key: 'value', 
	};
};

// app.set('views', __dirname + '/views'); // needed?
// or
// app.set('views', './views'); // needed?
// After the view engine is set, you don’t have to specify the engine or load the template engine module in your app; 
// Express loads the module internally
app.set('view engine', 'pug');
app.use('/images', express.static('./images'));

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

app.listen(8000);
console.log('Server running at localhost:8000')