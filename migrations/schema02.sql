CREATE TABLE contributors (
	username VARCHAR(50) PRIMARY KEY,
	first_name VARCHAR(30),
	last_name VARCHAR(30),
	email VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(50) NOT NULL,
	verified BOOLEAN DEFAULT FALSE,
	moderator BOOLEAN DEFAULT FALSE,
	bio VARCHAR(300),
	avatar TEXT,
	profile_pic TEXT,
	account_active BOOLEAN DEFAULT TRUE,
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	date_deleted TIMESTAMP,
	logged_in BOOLEAN DEFAULT FALSE
);

-- pictures & tags were relocated
-- 'posts' table has an item for each blogpost
CREATE TABLE posts (
	contr_username VARCHAR(50) REFERENCES contributors,
	date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP PRIMARY KEY,
	date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	title VARCHAR(250) NOT NULL,
	dek VARCHAR(500),
	body TEXT NOT NULL,
	url TEXT,
	slug TEXT,
	times_liked INTEGER DEFAULT 0,
);

-- 'tags' table has an item for each possible tag
CREATE TABLE tags (
	tags VARCHAR(50) PRIMARY KEY,
);

-- 'tags_posts' table has an item for each time you've assigned
--  a given tag (from the 'tags' table) to a post (from the 'posts' table)
CREATE TABLE tags_posts (
	tags VARCHAR(50) REFERENCES tags PRIMARY KEY,
	date_posted TIMESTAMP REFERENCES posts
);