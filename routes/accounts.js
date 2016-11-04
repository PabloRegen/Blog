'use strict';

const Promise = require('bluebird');
const checkit = require('checkit');
const scrypt = require('scrypt-for-humans');
// const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
// let upload = multer({ dest: 'uploads/' });
// const bhttp = require('bhttp');

module.exports = function(knex) {
    let router = require('express-promise-router')();

    /* signup */
    router.get('/signup', (req, res) => {
        res.render('accounts/signup');
    });

    router.post('/signup', (req, res) => {
        console.log(req.body);
        console.log(req.body.username, req.body.email, req.body.password, req.body.confirm_password);

        return Promise.try(() => {
            return checkit({
                username: ['required', 'alphaDash'],
                email: ['required', 'email', (email) => {
                    return Promise.try(() => {
                        return knex('users').where({email: email});
                    }).then((users) => {
                        if (users.length > 0) {
                            throw new Error('The email address is already in use.');
                        }
                    });
                }],
                password: ['required', 'minLength:8'],
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
            res.render('land'); // res.redirect('/dashboard');
        });
    });

    /* signin */
    router.get('/signin', (req, res) => {
        res.render('accounts/signin');
    });

    router.post('/signin', (req, res) => {
        console.log(req.body);
        console.log(req.body.usernameOrEmail, req.body.password);

        return Promise.try(() => {
            return knex('users').where('username', req.body.usernameOrEmail).orWhere('email', req.body.usernameOrEmail);
        }).then((user) => {
            if (user.length === 0) {
                throw new Error('The username or email does not exist');
            }
            return scrypt.verifyHash(req.body.password, user[0].pwHash);
        // }).catch(scrypt.PasswordError, (err) => {
        //     console.log('The password does not match the username or email');
        }).then(() => {
            // if (!isValid) {
            //     throw new Error('The password does not match the username or email');
            // }
            res.send({usernameOrEmail: req.body.usernameOrEmail, pass: req.body.password});
        });
    });

    /* profile */
    router.get('/profile', (req, res) => {
        res.render('accounts/profile');
    });

    router.post('/profile', (req, res) => {
        console.log(req.body);
        console.log(req.body.name, req.body.bio, req.body.userPic);

        return Promise.try(() => {
            return knex('users').insert({
                name: req.body.name, 
                bio: req.body.bio, 
                userPic: req.body.userPic
            });
        }).then(() => {
            res.send({name: req.body.name, bio: req.body.bio, userPic: req.body.userPic});
        });
    });

    return router;
};