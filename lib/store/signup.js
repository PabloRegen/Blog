module.exports = function(username, email, password) {
	return knex('users').insert([{username: username}, {email: email}, {pwHash: password}]);
};