-- Create tables for Twitter clone
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tweets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content VARCHAR(280) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    followee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followee_id)
);

CREATE TABLE IF NOT EXISTS likes (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, tweet_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tweets_user_id ON tweets(user_id);
CREATE INDEX IF NOT EXISTS idx_tweets_created_at ON tweets(created_at);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followee_id ON follows(followee_id);
CREATE INDEX IF NOT EXISTS idx_likes_tweet_id ON likes(tweet_id);

-- Insert some sample data for development
INSERT INTO users (username, email, password_hash, name, bio) VALUES
('johndoe', 'john@example.com', '$2b$10$examplehashedpassword', 'John Doe', 'Just a developer'),
('janedoe', 'jane@example.com', '$2b$10$examplehashedpassword', 'Jane Doe', 'Tech enthusiast'),
('alice', 'alice@example.com', '$2b$10$examplehashedpassword', 'Alice Smith', 'Love to code');

INSERT INTO tweets (user_id, content) VALUES
(1, 'Just launched my new Twitter clone! #excited'),
(2, 'Loving the new text-only social platform. So refreshing!'),
(3, 'The constraints of limited characters really make you think about what you want to say.');

INSERT INTO follows (follower_id, followee_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(3, 1);