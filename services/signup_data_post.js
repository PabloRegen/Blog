const pg = require('pg');

// instantiate a new client
const client = new pg.Client();

// connect to database 
client.connect(function(err) {
	if (err) throw err;

	// need to get the values from server.js
	// prepared statement???
	var insertIntoTable = `
	    INSERT INTO contributors (
	        username,
	        email,
	        password
	    )
	    VALUES (username, email, password)
	`;

	// execute a query on the db: insert data to 'contributors' table
	client.query(insertIntoTable, function(err, result) {
	    if (err) throw err;

	    // disconnect the client 
	    client.end(function (err) {
	    	if (err) throw err;
	    });
  	});
});

// export module or part of it
// module.exports = signup_data_post