-- To insert the next value of the sequence into the serial column exclude the column from the list of columns in the INSERT statement
-- CURRENT_TIMESTAMP: sometimes is better to just make it NOT NULL and handle the current-time stuff in the code (eg. issues: updating rows or work in the wrong timezone)
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	firstName TEXT,
	lastName TEXT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	bio TEXT,
	pic TEXT,
	isVerified BOOLEAN DEFAULT FALSE,
	isModerator BOOLEAN DEFAULT FALSE,
	isSignedin BOOLEAN DEFAULT FALSE,
	lastSigninAt TIMESTAMP,
	lastSeenAt TIMESTAMP,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	isActive BOOLEAN DEFAULT TRUE,
	deletedAt TIMESTAMP
);

-- removed username TEXT NOT NULL REFERENCES users (username),
CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	userId INTEGER NOT NULL REFERENCES users,
	title TEXT NOT NULL,
	subtitle TEXT,
	body TEXT NOT NULL,
	timesLiked INTEGER DEFAULT 0,
	timesShared INTEGER DEFAULT 0,
	postedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	isDeleted BOOLEAN DEFAULT FALSE,
	deletedAt TIMESTAMP
);

CREATE TABLE tags (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE
);

-- Junction table to create many-to-many relationships between tags & posts tables, & avoid adding duplicate entries
-- It has an item for each time you've assigned a given tag (from the 'tags' table) to a post (from the 'posts' table)
CREATE TABLE tags_posts (
	tagId INTEGER NOT NULL REFERENCES tags ON DELETE RESTRICT,
	postId INTEGER NOT NULL REFERENCES posts ON DELETE RESTRICT,
	PRIMARY KEY (tag_id, post_id)
);

CREATE TABLE slugs (
	id SERIAL PRIMARY KEY,
	postId INTEGER NOT NULL REFERENCES posts,
	name TEXT NOT NULL UNIQUE,
	isCurrent BOOLEAN DEFAULT FALSE
);