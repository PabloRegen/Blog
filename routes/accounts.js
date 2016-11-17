'use strict';

const Promise = require('bluebird');
const checkit = require('checkit');
const scrypt = require('scrypt-for-humans');
const rfr = require('rfr');
// const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
// let upload = multer({ dest: 'uploads/' });
// const bhttp = require('bhttp');

const errors = rfr('lib/errors');
const validatePassword = rfr('lib/validate-password');

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
                username: ['required', (username) => {
                    return Promise.try(() => {
                        return knex('users').where({username: username});
                    }).then((users) => {
                        if (users.length > 0) {
                            throw new errors.ValidationError('This username is taken.');
                        }
                    });                                            
                }],
                email: ['required', 'email', (email) => {
                    return Promise.try(() => {
                        return knex('users').where({email: email});
                    }).then((users) => {
                        if (users.length > 0) {
                            throw new errors.ValidationError('This email address is already in use.');
                        }
                    });
                }],
                password: ['required', validatePassword],
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
        }).catch(checkit.Error, (err) => {
            throw new errors.ValidationError('One or more fields are invalid.', {errors: err.errors});
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
            return checkit({
                usernameOrEmail: ['required'],
                password: ['required']
            }).run(req.body);
        }).then(() => {
            return knex('users').where('username', req.body.usernameOrEmail).orWhere('email', req.body.usernameOrEmail);
        }).then((user) => {
            if (user.length === 0) {
                //throw new errors.NotFoundError('The username or email does not exist');
                throw new Error('Invalid username or email.');
            }
            return scrypt.verifyHash(req.body.password, user[0].pwHash);
        }).then(() => {
            res.send({usernameOrEmail: req.body.usernameOrEmail, pass: req.body.password}); 
        }).catch(checkit.Error, (err) => {
            throw new errors.ValidationError('One or more fields are missing.', {errors: err.errors});
        }).catch(scrypt.PasswordError, (err) => {
            throw err;
            // throw err('Invalid password.');
            // err.message = 'Invalid password.'; throw err(err.message);
            // throw new Error('Invalid password.');
            // throw new errors.UnauthorizedError('Invalid password.');
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