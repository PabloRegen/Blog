'use strict';

const Promise = require('bluebird');
const bodyParser = require('body-parser');
const expressPromiseRouter = require('express-promise-router');

module exports = function(knex) {
    let router = expressPromiseRouter();

    router.get('/profile', (req, res) => {
        res.render('./forms/profile');
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