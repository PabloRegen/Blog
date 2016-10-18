'use strict';

const Promise = require('bluebird');
const bodyParser = require('body-parser');
const rfr = require('rfr');
const scrypt = require('scrypt-for-humans');
const checkit = require('checkit');
const expressPromiseRouter = require('express-promise-router');

module.exports = function(knex) {
    let router = expressPromiseRouter();

    router.get('/signup', (req, res) => {
        res.render('./forms/signup');
    });

    router.post('/signup', (req, res) => { // previously app.post
        let username = req.body.username
        let email = req.body.email
        console.log(req.body);
        console.log(req.body.username, req.body.email, req.body.password, req.body.confirm_password);

        return Promise.try(() => {
            return checkit({
                username: ['required', 'alphaDash', 'different:username', (username) => {
                    if (req.body.username[0] === ' ') {
                        throw new Error('The username can not start with a space.');
                    }
                }],
                email: ['required', 'email', (email) => {
                    return knex('users').where({email: req.body.email}).then((users) => {
                        if (users.length > 0) {
                            throw new Error('The email address is already in use.');
                        }
                    });
                }],
                password: ['required', 'minLength:8', 'maxLength:1024'],
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

    return router;
};