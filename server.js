const express = require('express');
const app = express();
const multer  = require('multer') // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
const upload = multer({ dest: 'uploads/' }); // or const upload = multer()?
const bodyParser = require('body-parser');

// // use an npm validator package instead?
// const signup_validator = require('./services/signup_validator.js');
// const profile_validator = require('./services/profile_validator.js');

var signup_data_post = require('./services/signup_data_post.js');

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false })); // must provide extended option
app.use('/images', express.static(__dirname + '/images')); // site picture
app.use(express.static(__dirname + '/styles')); // css files

// not needed unless views folder is named other than its default 'views' name (eg. 'hello') 
// app.set('views', __dirname + '/hello');

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

    res.render('./land');
});

app.listen(8000, () => {
    console.log('Server running at port 8000');
});