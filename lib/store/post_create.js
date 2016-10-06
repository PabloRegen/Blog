module.exports = function(title, subtitle, body, postPic) {
	return knex('users').insert([{subtitle: subtitle}, {body: body}]);
};