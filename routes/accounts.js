'use strict';

console.log("--> accounts route: RFR");

const Promise = require('bluebird');
const expressPromiseRouter = require('express-promise-router');
const checkit = require('checkit');
const scryptForHumans = require('scrypt-for-humans');
const rfr = require('rfr');
// const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
// let upload = multer({ dest: 'uploads/' });
// const bhttp = require('bhttp');

const errors = rfr('lib/errors');
const validatePassword = rfr('lib/validate-password');
const requireSignin = rfr('middleware/require-signin');

module.exports = function(knex) {
    console.log("--> accounts route: APP.USE");

    let router = expressPromiseRouter();

    /* signup */
    router.get('/signup', (req, res) => {
        res.render('accounts/signup');
    });

    router.post('/signup', (req, res) => {
        console.log(req.body);

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
            return scryptForHumans.hash(req.body.password);
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
    /* purpose: to authenticate users and set up the session (req.session.userId) */
    router.get('/signin', (req, res) => {
        res.render('accounts/signin');
    });

    router.post('/signin', (req, res) => {
        console.log(req.body);

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
                    return scryptForHumans.verifyHash(req.body.password, user.pwHash);
                }).then(() => {
                    /* Password was correct */
                    /* therefore set up req.session.userId for the current session */
                    req.session.userId = user.id;
                    res.redirect('/accounts/dashboard');
                }).catch(scryptForHumans.PasswordError, (err) => {
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

    /* dashboard */
    router.get('/dashboard', requireSignin, (req, res) => {
        return Promise.try(() => {
            return knex('posts').where({userId: req.user.id}).orderBy('id', 'desc');
        }).then((posts) => {
            console.log(`there are ${posts.length} posts`);

            res.render('accounts/dashboard', {
                latestPosts: posts
            });
        });
    });

    /* profile */
    router.get('/profile', requireSignin, (req, res) => {
        res.render('accounts/profile');
    });

    router.post('/profile', requireSignin, (req, res) => {
        console.log(req.body);

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