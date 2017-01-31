'use strict';

console.log("--> posts route: RFR");

const Promise = require('bluebird');
const expressPromiseRouter = require('express-promise-router');
const rfr = require('rfr');
// const multer  = require('multer'); // NOTE: form MUST be multipart format. https://www.npmjs.com/package/multer
// let upload = multer({ dest: 'uploads/' });
// const bhttp = require('bhttp');

const requireSignin = rfr('middleware/require-signin');

module.exports = function(knex) {
    console.log("--> posts route: APP.USE");

    const auth = rfr('middleware/auth')(knex);
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
            }).returning('id');
        }).then((postId) => {
            res.redirect(`/posts/${postId}`);
        });
    });

    /* edit */
    router.get('/:id/edit', requireSignin, auth(2), (req, res) => {
        console.log(req.body);
        console.log(`edit post ${req.params.id}`);

        return Promise.try(() => {
            return knex('posts').where({id: req.params.id});
        }).then((post) => {
            console.log(post[0]);
            res.render('posts/edit', {
                post: post[0]
            });
        });
    });

    router.post('/:id/edit', requireSignin, auth(2), (req, res) => {
        console.log(req.body);
        console.log(`edit post ${req.params.id}`);

        return Promise.try(() => {
            return knex('posts')
                .where({id: req.params.id})
                .update({
                    title: req.body.title, 
                    subtitle: req.body.subtitle, 
                    body: req.body.body
                })
                .returning('id');
        }).then((postId) => {
            res.redirect(`/posts/${postId}`);
        });
    });

    /* read */
    router.get('/:id', (req, res) => {
        console.log(req.body);
        console.log(`read post ${req.params.id}`);

        return Promise.try(() => {
            return knex('posts').where({id: req.params.id});
        }).then((post) => {
            console.log(post[0]);
            res.render('posts/read', {
                post: post[0]
            });
        });
    });

    /* delete */
    router.delete('/:id/delete', requireSignin, auth(2), (req, res) => {
        console.log(`delete post ${req.params.id}`);
        // do something: soft or hard delete?
    });

    return router;
};