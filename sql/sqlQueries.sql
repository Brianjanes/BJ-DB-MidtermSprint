-- creating tables
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    genre VARCHAR(100) NOT NULL,
    director VARCHAR(255) NOT NULL
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number TEXT NOT NULL
);

CREATE TABLE rentals (
    rental_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(movie_id),
    rental_date DATE NOT NULL,
    return_date DATE
);

-- Sample data for testing
-- Inserting 5 movies
INSERT INTO movies (title, year, genre, director) VALUES
    ('Oppenheimer', 2023, 'Drama', 'Christopher Nolan'),
    ('Barbie', 2023, 'Comedy', 'Greta Gerwig'),
    ('Poor Things', 2023, 'Drama', 'Yorgos Lanthimos'),
    ('Spider-Man: Across the Spider-Verse', 2023, 'Animation', 'Joaquim Dos Santos'),
    ('Everything Everywhere All at Once', 2022, 'Sci-Fi', 'Daniels');

-- insert customers inserts
INSERT INTO customers (first_name, last_name, email, phone_number) VALUES
    ('John', 'Doe', 'john.doe@email.com', '555-0101'),
    ('Jane', 'Smith', 'jane.smith@email.com', '555-0102'),
    ('Bob', 'Johnson', 'bob.johnson@email.com', '555-0103'),
    ('Alice', 'Williams', 'alice.williams@email.com', '555-0104'),
    ('Charlie', 'Brown', 'janes.brian@gmail.com', '555-0105');

-- sample rentals 
INSERT INTO rentals (customer_id, movie_id, rental_date, return_date) VALUES
    (1, 1, '2024-03-01', '2024-03-05'),
    (2, 2, '2024-03-02', '2024-03-06'),
    (3, 3, '2024-03-03', NULL),
    (4, 4, '2024-03-04', NULL),
    (5, 5, '2024-03-05', '2024-03-09'),
    (1, 3, '2024-03-06', '2024-03-10'),
    (2, 4, '2024-03-07', NULL),
    (3, 5, '2024-03-08', '2024-03-12'),
    (4, 1, '2024-03-09', NULL),
    (5, 2, '2024-03-10', '2024-03-14');

-- list all the movies rented by a specific customer using their email
SELECT m.title, r.rental_date, r.return_date
FROM movies m
JOIN rentals r ON m.movie_id = r.movie_id
JOIN customers c ON r.customer_id = c.customer_id
WHERE c.email = 'janes.brian@gmail.com'
ORDER BY r.rental_date;

-- all customers who have rented a specific movie
SELECT DISTINCT c.first_name, c.last_name, c.email, r.rental_date
FROM customers c
JOIN rentals r ON c.customer_id = r.customer_id
JOIN movies m ON r.movie_id = m.movie_id
WHERE m.title = 'Barbie'
ORDER BY r.rental_date;

-- rental history for a movie
SELECT m.title, c.first_name, c.last_name, r.rental_date, r.return_date
FROM rentals r
JOIN movies m ON r.movie_id = m.movie_id
JOIN customers c ON r.customer_id = c.customer_id
WHERE m.title = 'Everything Everywhere All at Once'
ORDER BY r.rental_date;

-- all rentals by director
SELECT c.first_name, c.last_name, m.title, r.rental_date
FROM rentals r
JOIN movies m ON r.movie_id = m.movie_id
JOIN customers c ON r.customer_id = c.customer_id
WHERE m.director = 'Christopher Nolan'
ORDER BY r.rental_date;

-- all movies that are currently rented
SELECT m.title, c.first_name, c.last_name, r.rental_date
FROM rentals r
JOIN movies m ON r.movie_id = m.movie_id
JOIN customers c ON r.customer_id = c.customer_id
WHERE r.return_date IS NULL
ORDER BY r.rental_date;