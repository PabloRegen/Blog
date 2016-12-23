// toi

exports.up = function(knex, Promise) {
	return knex.schema.table("users", function(table) {
		table.boolean("signupFlowCompleted");
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.table("users", function(table) {
		table.dropColumn("signupFlowCompleted");
	});
};

//-------------------------

'use strict';

exports.up = function(knex, Promise) {
	return knex.schema.table("users", function(table) {
		table.boolean("onboardingFlowCompleted").defaultTo(false);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.table("users", function(table) {
		table.dropColumn("onboardingFlowCompleted");
	});
};

//-------------------------

exports.up = function(knex, Promise) {
	return knex.schema.table("users", function(table) {
		table.integer("failedLoginAttempts").notNullable().default(0);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.table("users", function(table) {
		table.dropColumn("failedLoginAttempts");
	})
};

//-------------------------

exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("users", function(table) {
			table.boolean("hasStripeToken").notNullable().default(false);
			table.text("stripeCustomerId");
			table.text("stripeSubscriptionId");
		}),
		knex.schema.table("plans", function(table) {
			table.integer("stripePlanId");
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("users", function(table) {
			table.dropColumn("hasStripeToken");
			table.dropColumn("stripeCustomerId");
			table.dropColumn("stripeSubscriptionId");
		}),
		knex.schema.table("plans", function(table) {
			table.dropColumn("stripePlanId");
		})
	]);
};

//-------------------------

exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("sites", function(table) {
			table.timestamp("createdAt", "dateTime");
			table.timestamp("updatedAt", "dateTime");
		}),
		knex.schema.table("plans", function(table) {
			table.timestamp("createdAt", "dateTime");
			table.timestamp("updatedAt", "dateTime");
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("sites", function(table) {
			table.dropColumns("createdAt", "updatedAt");
		}),
		knex.schema.table("plans", function(table) {
			table.dropColumns("createdAt", "updatedAt");
		})
	]);
};

//-------------------------

exports.up = function(knex, Promise) {
	return knex.raw("ALTER TABLE sites ALTER COLUMN \"planId\" DROP NOT NULL");
};

exports.down = function(knex, Promise) {
	return knex.raw("ALTER TABLE sites ALTER COLUMN \"planId\" SET NOT NULL");
};

//-------------------------

// Make subdomainName field UNIQUE
exports.up = function(knex, Promise) {
	return knex.raw("CREATE UNIQUE INDEX unique_subdomain ON sites USING btree (\"subdomainName\")");
};

exports.down = function(knex, Promise) {
	return knex.raw("DROP INDEX unique_subdomain");
};
