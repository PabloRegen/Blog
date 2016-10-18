'use strict';

const expressPromiseRouter = require('express-promise-router');

let router = expressPromiseRouter();

router.get('/post_edit', (req, res) => {
    res.render('./post/edit');
});

module.exports = router;