'use strict';

const Promise = require('bluebird');
const rfr = require('rfr');
// const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
// let upload = multer({ dest: 'uploads/' });
// const bhttp = require('bhttp');

module.exports = function(knex) {
    const requireSignin = rfr('middleware/require-signin')(knex);
    let router = require('express-promise-router')();
 
    /* create */
    router.get('/create', requireSignin, (req, res) => {
        res.render('posts/create');
    });

    router.post('/create', requireSignin, (req, res) => {
        console.log(req.body);
        console.log(req.body.title, req.body.subtitle, req.body.body, req.body.postPic);

        return Promise.try(() => {
            return knex('posts').insert({
                userId: req.session.userId,
                title: req.body.title, 
                subtitle: req.body.subtitle, 
                body: req.body.body
            });
        }).then(() => {
            res.send({title: req.body.title, subtitle: req.body.subtitle, body: req.body.body, postPic: req.body.postPic});
        });
    });

    /* edit */
    router.get('/:id/edit', requireSignin, (req, res) => {
        res.render('posts/edit');
    });

    router.post('/:id/edit', requireSignin, (req, res) => {
        // do something
    });

    /* read */
    router.get('/:id', (req, res) => {
        res.render('posts/read');
    });

    /* delete */
    router.delete('/:id/delete', requireSignin, (req, res) => {
        // do something
    });

    return router;
};