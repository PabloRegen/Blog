const pg = require('pg');
const knex = require('knex')({client: 'pg'});

// CASE 1: USING SIMPLE EXAMPLE FROM NPM PG
module.exports = function(username, email, password) {

	// instantiate a new client
	var client = new pg.Client();

	// connect to database 
	client.connect(function(err) {
		if (err) throw err;

		var insertIntoTable = knex('users').insert([{username: username}, {email: email}, {password: password}]);

		// execute a query on the db: insert data into 'users' table
		client.query(insertIntoTable, function(err, result) {
		    if (err) throw err;

		    // disconnect the client 
		    client.end(function (err) {
		    	if (err) throw err;
		    });
	  	});
	});
};

// CASE 2: USING CLIENT POOLING FROM NPM PG
module.exports = function(username, email, password) {

	// configure pooling behavior and client options 
	// note: all config is optional and the environment variables will be read if the config is not present 
	var config = {
	  user: 'foo', //env var: PGUSER 
	  database: 'my_db', //env var: PGDATABASE 
	  password: 'secret', //env var: PGPASSWORD 
	  port: 5432, //env var: PGPORT 
	  max: 10, // max number of clients in the pool 
	  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
	};

	// initialize a connection pool. It will keep idle connections open for a 30 seconds and set a limit of maximum 10 idle clients 
	var pool = new pg.Pool(config);

	// acquire a client from the pool, run a query on the client, and then return the client to the pool 
	pool.connect(function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}

		var insertIntoTable = knex('users').insert([{username: username}, {email: email}, {password: password}]);

		client.query(insertIntoTable, function(err, result) {
			// release the client back to the pool 
			done();
	 
			if(err) {
			  return console.error('error running query', err);
			}
	  	});
	});

	pool.on('error', function (err, client) {
		// if an error is encountered by a client while it sits idle in the pool 
		// the pool itself will emit an error event with both the error and the client which emitted the original error  
		console.error('idle client error', err.message, err.stack)
	})
};