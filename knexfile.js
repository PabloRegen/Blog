'use strict';

let config = require('./config.json');

module.exports = {

    client: 'postgresql',
    connection: {
        host:     config.database.hostname,
        user:     config.database.username,
        password: config.database.password,
        database: config.database.database
    }
    /*
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
    acquireConnectionTimeout:
    searchPath: 'knex,public'
    */
};