'use strict';

// const expressPromiseRouter = require('express-promise-router');
// let router = expressPromiseRouter();
const express = require('express');
let router = express.Router();

router.get('/routes/home', (req, res) => {
	res.render('./home');
});

module.exports = router;