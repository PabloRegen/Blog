'use strict';

const express = require('express');
const path = require('path');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
// const rfr = require('rfr');
// const scrypt = require('scrypt-for-humans');
// const checkit = require('checkit');
const expressPromiseRouter = require('express-promise-router');

let router = expressPromiseRouter();

// router.set('view engine', 'pug');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(express.static(path.join(__dirname, './public')));

module.exports = function(knex) {
    // let router = expressPromiseRouter();

    /* create */
    router.get('/create', (req, res) => {
        res.render('./posts/create');
    });

    router.post('/create', (req, res) => {
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

    /* edit */
    router.get('/:id/edit', (req, res) => {
        res.render('./posts/edit');
    });

    router.post('/:id/edit', (req, res) => {
        // do something
    });

    /* read */
    router.get('/:id', (req, res) => {
        res.render('./posts/read');
    });

    /* delete */
    router.delete('/:id/delete', (req, res) => {
        // do something
    });

    return router;
};