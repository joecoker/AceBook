
CREATE TABLE users (
    userId SERIAL PRIMARY KEY,
    firstName varchar(50),
    lastName varchar(50),
    email varchar(100),
    password varchar(140),
    dob date,
    profilePictureUrl varchar(255),
    createdAt timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
    postId SERIAL PRIMARY KEY,
    userId int4,
    content varchar(1000),
    createdAt timestamptz NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE likes (
    likeId SERIAL PRIMARY KEY,
    postId int4,
    userId int4,
    FOREIGN KEY (postId) REFERENCES posts(postId),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE comments (
    commentId SERIAL PRIMARY KEY,
    postId int4,
    userId int4,
    content varchar(1000),
    createdAt timestamptz NOT NULL DEFAULT NOW(),
    FOREIGN KEY (postId) REFERENCES posts(postId),
    FOREIGN KEY (userId) REFERENCES users(userId)
);
