'use strict';

const Promise = require('bluebird');
const bodyParser = require('body-parser');
const expressPromiseRouter = require('express-promise-router');


module exports = function(knex) {
    let router = expressPromiseRouter();

    router.get('/post_create', (req, res) => {
        res.render('./post/create');
    });

    router.post('/post_create', (req, res) => {
        console.log(req.body);
        console.log(req.body.title, req.body.subtitle, req.body.body, req.body.postPic);

        return Promise.try(() => {
            return knex('posts').insert({
                title: req.body.title, 
                subtitle: req.body.subtitle, 
                body: req.body.body
            });
        }).then(() => {
            res.send({title: req.body.title, subtitle: req.body.subtitle, body: req.body.body, postPic: req.body.postPic});
        });
    });

    return router;
};