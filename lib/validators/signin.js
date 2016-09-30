// signin validation against signup info

module.exports = function(usernameOrEmail, password) {
	let usernameOrEmailCheck = knex('users').where('username', usernameOrEmail).orWhere('email', usernameOrEmail);
	// check if username or email exist
	if (usernameOrEmailCheck.length === 0) {
		return 'The username or email does not exist';
	// check if password is correct for this username or email
	} else if (password !== usernameOrEmailCheck.select('psHash')) {
		return 'The password does not match the username or email';
	} else {
		// signin & display page after signin
	}
};

// Is this the same?
let usernameOrEmailCheck = knex('users').where(function() {
  this.where('username', usernameOrEmail).orWhere('email', usernameOrEmail)
});