'use strict';

const Promise = require('bluebird');
const bodyParser = require('body-parser');
const rfr = require('rfr');
const scrypt = require('scrypt-for-humans');
const checkit = require('checkit');
const expressPromiseRouter = require('express-promise-router');

let router = expressPromiseRouter();

let knexfile = rfr('knexfile');
let knex = require('knex')(knexfile);

router.use('/url', function (req, res) {
    return Promise.reject();
})

router.use('/url', function (req, res) {
    // equivalent to calling next() 
    return Promise.resolve('next');
});

// Or use this one instead?
router.use('/url', function (req, res) {
    // equivalent to calling next('route') 
    return Promise.resolve('route');

});

router.get('/signup', (req, res) => {
    res.render('./forms/signup');
});

router.post('/signup', (req, res) => { // previously app.post
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

module.exports = router;