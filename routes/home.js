'use strict';

const express = require('express');
const path = require('path');
const expressPromiseRouter = require('express-promise-router');

let router = expressPromiseRouter();

// router.set('view engine', 'pug');

router.use(express.static(path.join(__dirname, './public')));

router.get('/', (req, res) => {
	res.render('./home');
});

module.exports = router;