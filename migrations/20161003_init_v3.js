// To insert the next value of the sequence into the serial column exclude the column from the list of columns in the INSERT statement
// CURRENT_TIMESTAMP: sometimes is better to just make it NOT NULL and handle the current-time stuff in the code 
// (eg. issues: updating rows or work in the wrong timezone)

'use strict';

let createTableUsers = knex.schema.createTable('users', function(t) {
	t.increments();
	t.text('username').notNullable().unique();
	t.text('name');
	t.text('email').notNullable().unique();
	t.text('pwHash').notNullable();
	t.text('bio');
	t.text('pic');
	t.timestamp('createdAt').defaultsTo(knex.raw('CURRENT_TIMESTAMP'));
	t.timestamp('lastSigninAt', true);
	t.timestamp('lastSeenAt', true);
	t.timestamp('deletedAt', true);
	t.boolean('isActive').defaultTo(true);
	t.boolean('isVerified').defaultTo(false);
	t.boolean('isModerator').defaultTo(false);
});

let createTableTags = knex.schema.createTable('tags', function(t) {
	t.increments();
	t.text('name').notNullable().unique();
	t.timestamp('deletedAt', true);
});

let createTablePosts = knex.schema.createTable('posts', function(t) {
	t.increments();
	t.integer('userId').notNullable().references('users.id').onDelete('RESTRICT');
	t.text('title').notNullable();
	t.text('subtitle');
	t.text('body').notNullable();
	t.timestamp('postedAt').defaultsTo(knex.raw('CURRENT_TIMESTAMP'));
	t.timestamp('updatedAt').defaultsTo(knex.raw('CURRENT_TIMESTAMP'));
	t.timestamp('deletedAt', true);
	t.boolean('isVisible').defaultTo(true);
});

let createTableTags_posts = knex.schema.createTable('tags_posts', function(t) {
	t.increments();
	t.integer('tagId').notNullable().references('tags.id').onDelete('RESTRICT');
	t.integer('postId').notNullable().references('posts.id').onDelete('RESTRICT');
});

let createTableSlugs = knex.schema.createTable('slugs', function(t) {
	t.increments();
	t.integer('postId').notNullable().references('posts.id').onDelete('RESTRICT');
	t.text('name').notNullable();
	t.boolean('isCurrent').defaultTo(false);
});

exports.up = function(knex, Promise) {
	return Promise.try(function() {
		return createTableUsers;
	})
	.then(function() {
		return createTableTags;
	})
	.then(function() {
		return createTablePosts;
	})
	.then(function() {
		return createTableTags_posts;
	})
	.then(function() {
		return createTableSlugs;
	});
};

exports.down = function(knex, Promise) {
	return Promise.try(function() {
		return knex.schema.dropTableIfExists('tags_posts');
	})
	.then(function() {
		return knex.schema.dropTableIfExists('slugs');
	})
	.then(function() {
		return knex.schema.dropTableIfExists('posts');
	})
	.then(function() {
		return knex.schema.dropTableIfExists('users');
	})
	.then(function() {
		return knex.schema.dropTableIfExists('tags');
	});
};