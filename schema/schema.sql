CREATE TABLE contributors (
	username 		VARCHAR(50) PRIMARY KEY,
	first_name 		VARCHAR(30),
	last_name 		VARCHAR(30),
    email 			VARCHAR(50) NOT NULL UNIQUE,
    password 		TEXT NOT NULL, 						 -- need hash
    verified 		BOOLEAN DEFAULT FALSE,
    moderator 		BOOLEAN DEFAULT FALSE,
    bio 			VARCHAR(300),
    avatar			TEXT, 								 -- data type? add default avatar
    profile_pic		TEXT, 								 -- data type?
    account_active 	BOOLEAN DEFAULT TRUE,
    date_created 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- or now()?
    date_updated 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- or now()?
    date_deleted 	TIMESTAMP,
    logged_in 		BOOLEAN DEFAULT FALSE
);

CREATE TABLE posts (
	contr_username	VARCHAR(50) REFERENCES contributors,
	date_posted 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP PRIMARY KEY,
	date_updated 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	title 			VARCHAR(250) NOT NULL,
	dek 			VARCHAR(500),
	body 			TEXT NOT NULL,
	pictures		TEXT,								-- Separate table? data type?
	url				TEXT,								-- Separate table?
	slug			TEXT,								-- Separate table?
	times_liked		INTEGER DEFAULT 0,
	tags			TEXT
);