CREATE TABLE IF NOT EXISTS movies {
    title VARCHAR(255) NOT NULL,
    release_year INTEGER NOT NULL,
    director VARCHAR(255) NOT NULL,
}

CREATE TAVBLE IF NOT EXISTS customers {
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
}

CREATE TABLE IF NOT EXISTS rentals {
    renter_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    rental_date = DATE NOT NULL,
    return_date = DATE NOT NULL,
}