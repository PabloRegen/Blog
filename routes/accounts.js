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
    const requireSignin = rfr('middleware/require-signin')(knex);
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
                            throw new errors.ValidationError('The username is taken');
                        }
                    });                                            
                }],
                email: ['required', 'email', (email) => {
                    return Promise.try(() => {
                        return knex('users').where({email: email});
                    }).then((users) => {
                        if (users.length > 0) {
                            throw new errors.ValidationError('The email address is already in use');
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
            res.redirect('/posts/create'); // send a confirmation email instead
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
            return knex('users').where({username: req.body.usernameOrEmail}).orWhere({email: req.body.usernameOrEmail});
        }).then((users) => {
            if (users.length === 0) {
                throw new errors.NotFoundError('Invalid username or email'); // errors.AuthenticationError???
            } else {
                let user = users[0];

                return Promise.try(() => {
                    return scrypt.verifyHash(req.body.password, user.pwHash);
                }).then(() => {
                    /* Password was correct */
                    req.session.userId = user.id; // set req.session.userId for the current express session
                    res.redirect('/posts/create');
                }).catch(scrypt.PasswordError, (err) => {
                    throw new errors.UnauthorizedError('Invalid password'); // errors.AuthenticationError???
                });
            }
        }).catch(checkit.Error, (err) => {
            throw new errors.ValidationError('One or more fields are missing', {errors: err.errors});
        });
    });

    /* signout */
    router.get('/signout', requireSignin, (req, res) => {
        req.session.destroy();
        res.redirect('/accounts/signin');
    });

    /* profile */
    router.get('/profile', requireSignin, (req, res) => {
        res.render('accounts/profile');
    });

    router.post('/profile', requireSignin, (req, res) => {
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