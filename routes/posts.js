'use strict';

const Promise = require('bluebird');
const expressPromiseRouter = require('express-promise-router');
const rfr = require('rfr');
// const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
// let upload = multer({ dest: 'uploads/' });
// const bhttp = require('bhttp');

const requireSignin = rfr('middleware/require-signin');

module.exports = function(knex) {
    let router = expressPromiseRouter();
 
    /* create */
    router.get('/create', requireSignin, (req, res) => {
        res.render('posts/create');
    });

    router.post('/create', requireSignin, (req, res) => {
        console.log(req.body);

        return Promise.try(() => {
            return knex('posts').insert({
                userId: req.user.id,
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
        console.log('edit post ' + req.params.id);
        res.render('posts/edit');
    });

    router.post('/:id/edit', requireSignin, (req, res) => {
        console.log('edit post ' + req.params.id);
        // do something
    });

    /* read */
    router.get('/:id', (req, res) => {
        console.log(req.body);
        console.log('read post ' + req.params.id);

        return Promise.try(() => {
            return knex('posts').where({ id : req.params.id });
        }).then((post) => {
            console.log(post[0]);
            res.render('posts/read', {
                post: post[0]
            });
        });
    });

    /* delete */
    router.delete('/:id/delete', requireSignin, (req, res) => {
        console.log('delete post ' + req.params.id);
        // do something
    });

    return router;
};