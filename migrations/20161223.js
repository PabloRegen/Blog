exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("users", function(table) {
			table.integer("role").notNullable().defaultTo(1);
			table.dropColumn("isModerator");
		}),
		knex.raw('ALTER TABLE posts ALTER "updatedAt" DROP DEFAULT')
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("users", function(table) {
			table.dropColumn("role");
			table.boolean('isModerator').defaultTo(false);
		}),
		knex.raw('ALTER TABLE posts ALTER "updatedAt" SET DEFAULT "CURRENT_TIMESTAMP"')
	]);
};