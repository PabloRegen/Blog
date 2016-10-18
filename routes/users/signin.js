'use strict';

const Promise = require('bluebird');
const bodyParser = require('body-parser');
const scrypt = require('scrypt-for-humans');
const expressPromiseRouter = require('express-promise-router');

module exports = function(knex) {
    let router = expressPromiseRouter();

    router.get('/signin', (req, res) => {
        res.render('./forms/signin');
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

    return router;
};