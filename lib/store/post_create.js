module.exports = function(title, subtitle, body, postPic) {
	return knex('posts').insert([{title: title}, {subtitle: subtitle}, {body: body}]);
};