-- Delete data base if exist
DROP DATABASE IF EXIST moviesDb;

-- Create Data Bata Base
CREATE DATABASE moviesDb;

-- Use the new moviesDb data base
USE moviesDb;

-- Create movies table
CREATE TABLE movie (
	id BINARY(16) PRIMARY KEY DEFAULT(UUID_TO_BIN(UUID())),
	title VARCHAR(255) NOT NULL,
	year INT NOT NULL,
	director VARCHAR(255) NOT NULL,
	duration INT NOT NULL,
	poster TEXT,
	rate DECIMAL(2, 1) UNSIGNED NOT NULL
);
-- Create genre table
CREATE TABLE genre (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL UNIQUE
);
-- Create movies genre table relation
CREATE TABLE movie_genre(
 	movie_id BINARY(16) REFERENCES movie(id),
	genre_id INT REFERENCES genre(id),
	PRIMARY KEY (movie_id, genre_id)
);

-- Populate data
INSERT INTO genre (name) VALUES 
("Drama"), ("Action"), ("Crime"), ("Adventure"), ("Sci-Fi"), ("Romance");

INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES 
(UUID_TO_BIN(UUID()), "The Shawshank Redemption", 1994, "Frank Darabont", 142, "https://mgallegoa.github.io/vanillaJS/basic_express_movies_mvc/public/images/The_Shawshank_Redemption.webp", 9.3),
(UUID_TO_BIN(UUID()), "The Dark Knight", 2008, "Christopher Nolan", 152, "https://mgallegoa.github.io/vanillaJS/basic_express_movies_mvc/public/images/The_Dark_Knight.jpg", 9.0),
(UUID_TO_BIN(UUID()), "Inception", 2010, "Christopher Nolan", 148, "https://mgallegoa.github.io/vanillaJS/basic_express_movies_mvc/public/images/Inception.jpg", 8.8),
(UUID_TO_BIN(UUID()), "Pulp Fiction", 1994, "Quentin Tarantino", 154, "https://mgallegoa.github.io/vanillaJS/basic_express_movies_mvc/public/images/Pulp_Fiction.jpg", 8.9),
(UUID_TO_BIN(UUID()), "Forrest Gump", 1994, "Robert Zemeckis", 142, "https://mgallegoa.github.io/vanillaJS/basic_express_movies_mvc/public/images/Forrest_Gump.jpg", 8.8);

INSERT INTO movie_genre (movie_id, genre_id) VALUES (
	((SELECT id FROM movie WHERE title ="The Shawshank Redemption"),	(SELECT id FROM genre WHERE name = "Drama")), 
	((SELECT id FROM movie WHERE title ="The Dark Knight"),	(SELECT id FROM genre WHERE name = "Action")),
	((SELECT id FROM movie WHERE title ="The Dark Knight"),	(SELECT id FROM genre WHERE name = "Crime")),
	((SELECT id FROM movie WHERE title ="The Dark Knight"),	(SELECT id FROM genre WHERE name = "Drama")),
	((SELECT id FROM movie WHERE title ="Inception"),	(SELECT id FROM genre WHERE name = "Action")),
	((SELECT id FROM movie WHERE title ="Inception"),	(SELECT id FROM genre WHERE name = "Sci-Fi")),
	((SELECT id FROM movie WHERE title ="Pulp Fiction"),	(SELECT id FROM genre WHERE name = "Drama")),
	((SELECT id FROM movie WHERE title ="Pulp Fiction"),	(SELECT id FROM genre WHERE name = "Crime")),
	((SELECT id FROM movie WHERE title ="Forrest Gump"),	(SELECT id FROM genre WHERE name = "Drama")),
	((SELECT id FROM movie WHERE title ="Forrest Gump"),	(SELECT id FROM genre WHERE name = "Romance")),
);

-- Select movie table
SELECT * FROM movie