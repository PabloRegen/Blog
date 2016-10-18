'use strict';

const expressPromiseRouter = require('express-promise-router');

let router = expressPromiseRouter();

router.get('/post_read', (req, res) => {
    res.render('./post/read');
});

module.exports = router;