module.exports = function(name, bio, userPic) {
	return knex('users').insert([{name: name}, {bio: bio}, {userPic: userPic}]);
};