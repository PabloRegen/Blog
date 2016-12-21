'use strict';

console.log("--> home route: RFR");

let router = require('express-promise-router')();

router.get('/', (req, res) => {
	res.render('home');
});

/*
router.get('/about', (req, res) => {
	res.render('about');
});

router.get('/contact', (req, res) => {
	res.render('contact');
});
*/

module.exports = router;