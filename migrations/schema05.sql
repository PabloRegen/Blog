-- To insert the next value of the sequence into the serial column exclude the column from the list of columns in the INSERT statement
-- CURRENT_TIMESTAMP: sometimes is better to just make it NOT NULL and handle the current-time stuff in the code (eg. issues: updating rows or work in the wrong timezone)
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	name TEXT,
	email TEXT NOT NULL UNIQUE,
	pwHash TEXT NOT NULL,
	bio TEXT,
	pic TEXT,
	isVerified BOOLEAN DEFAULT FALSE,
	isModerator BOOLEAN DEFAULT FALSE,
	lastSigninAt TIMESTAMP,
	lastSeenAt TIMESTAMP,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	isActive BOOLEAN DEFAULT TRUE,
	deletedAt TIMESTAMP
);

CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	userId INTEGER NOT NULL REFERENCES users ON DELETE RESTRICT,
	title TEXT NOT NULL,
	subtitle TEXT,
	body TEXT NOT NULL,
	postedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deletedAt TIMESTAMP
);

CREATE TABLE tags (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE
	-- deletedAt TIMESTAMP - need a soft delete scenario?
);

-- Junction table to create many-to-many relationships between tags & posts tables, & avoid adding duplicate entries
-- It has an item for each time a given tag (from the 'tags' table) is assigned to a post (from the 'posts' table)
CREATE TABLE tags_posts (
	id SERIAL PRIMARY KEY,
	tagId INTEGER NOT NULL REFERENCES tags ON DELETE RESTRICT,
	postId INTEGER NOT NULL REFERENCES posts ON DELETE RESTRICT,
);

CREATE TABLE slugs (
	id SERIAL PRIMARY KEY,
	postId INTEGER NOT NULL REFERENCES posts ON DELETE RESTRICT,
	name TEXT NOT NULL UNIQUE,
	isCurrent BOOLEAN DEFAULT FALSE
);