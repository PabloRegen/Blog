'use strict';

exports.up = function (knex, Promise) {
	return Promise.all([
		knex.schema.createTable('users', function(t) {
			t.increments();
			t.text('username').notNullable().unique();
			t.text('firstName');
			t.text('LastName');
			t.text('email').notNullable().unique();
			t.text('password').notNullable();
			t.text('bio');
			t.text('pic');
			t.boolean('isVerified').defaultTo(FALSE);
			t.boolean('isModerator').defaultTo(FALSE);
			t.boolean('isSignedin').defaultTo(FALSE);
			t.timestamp('lastSigninAt', TRUE);
			t.timestamp('lastSeenAt', TRUE);
			t.timestamp('createdAt', 'dateTime'); // or t.timestamp('createdAt') or t.timestamp('createdAt').defaultTo(knex.fn.now()); ???
			t.boolean('isActive').defaultTo(TRUE);
			t.timestamp('deletedAt', TRUE);
		}),
		knex.schema.createTable('posts', function(t) {
			t.increments();
			t.integer('userId').notNullable().references('users.id');
			t.text('title').notNullable();
			t.text('subtitle');
			t.text('body')notNullable();
			t.integer('timesLiked').defaultTo(0);
			t.integer('timesShared').defaultTo(0);
			t.timestamp('postedAt', 'dateTime'); // or t.timestamp('postedAt') or t.timestamp('postedAt').defaultTo(knex.fn.now()); ???
			t.timestamp('updatedAt', 'dateTime'); // or t.timestamp('updatedAt') or t.timestamp('updatedAt').defaultTo(knex.fn.now()); ???
			t.boolean('isDeleted').defaultTo(FALSE);
			t.timestamp('deletedAt', TRUE);
		}),
		knex.schema.createTable('tags', function(t) {
			t.increments();
			t.text('name').notNullable().unique();
		}),
		knex.schema.createTable('tags_posts', function(t) {
			t.integer('tagId').notNullable().references('tags.id').onDelete(RESTRICT);
			t.integer('postId').notNullable().references('posts.id').onDelete(RESTRICT);
			t.primary(['tag_id', 'post_id'])
		}),
		knex.schema.createTable('slugs', function(t) {
			t.increments();
			t.integer('postId').notNullable().references('posts.id');
			t.text('name').notNullable().unique();
			t.boolean('isCurrent').defaultTo(FALSE);
		})
	])
};

exports.down = function (knex, Promise) {
	return Promise.all([
		knex.schema.dropTableIfExists('users'),
		knex.schema.dropTableIfExists('posts'),
		knex.schema.dropTableIfExists('tags'),
		knex.schema.dropTableIfExists('tags_posts'),
		knex.schema.dropTableIfExists('slugs')
	])
};