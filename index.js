const { Pool } = require("pg");

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "movie_db",
  password: "Wormy1!",
  port: 5432,
});

// I like to include some empty console.log()s above stuf that prints in the terminal to help with readability

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  // Create the table for movies
  const createMovieTable = `CREATE TABLE IF NOT EXISTS movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    genre VARCHAR(100) NOT NULL,
    director VARCHAR(255) NOT NULL
  );`;

  // Create the table for customers
  const createCustomerTable = `CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number TEXT NOT NULL
  );`;

  // Create the table for rentals
  const createRentalTable = `CREATE TABLE IF NOT EXISTS rentals (
    rental_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(movie_id),
    rental_date DATE NOT NULL,
    return_date DATE
  );`;

  // using a try catch block for potential errors (i bet i willforget to open pgadmin and start the server)
  try {
    await pool.query(createMovieTable);
    await pool.query(createCustomerTable);
    await pool.query(createRentalTable);

    console.log();
    console.log(
      "Tables for movies, customers and rentals created successfully."
    );
  } catch (error) {
    console.log();
    console.error("Error: ", error);
    return;
  }
}

/**
 * Inserts a new movie into the Movies table.
 *
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  const newMovie = `INSERT INTO movies (title, year, genre, director) 
                    VALUES ($1, $2, $3, $4) 
                    RETURNING movie_id, title`;

  try {
    const result = await pool.query(newMovie, [title, year, genre, director]);
    console.log();
    console.log(
      `New movie added: "${title}" with ID ${result.rows[0].movie_id}`
    );
  } catch (error) {
    console.log();
    console.error("Error: ", error.message);
  }
}

/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  const getMovies = `SELECT * FROM movies ORDER BY title`;

  try {
    const result = await pool.query(getMovies);
    console.log();
    console.log("Movies in the database:");
    if (result.rows.length === 0) {
      console.log();
      console.log("No movies found in the database.");
      return;
    }

    result.rows.forEach((movie) => {
      console.log();
      console.log(
        `  ${movie.title} (${movie.year}) - ${movie.genre}, directed by ${movie.director}`
      );
    });
  } catch (error) {
    console.log();
    console.error("Error ", error.message);
  }
}

/**
 * Updates a customer's email address.
 *
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  const updateEmail = `
    UPDATE customers 
    SET email = $2 
    WHERE customer_id = $1
    RETURNING customer_id, first_name, last_name, email`;

  try {
    const result = await pool.query(updateEmail, [customerId, newEmail]);
    if (result.rows.length === 0) {
      console.log();
      console.log(`No customer found with ID ${customerId}`);
      return;
    }
    const customer = result.rows[0];
    console.log();
    console.log(
      `Updated email for: ${customer.first_name} ${customer.last_name} to ${customer.email}`
    );
  } catch (error) {
    console.log();
    console.error("Error :", error.message);
  }
}

/**
 * Removes a customer from the database along with their rental history.
 *
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  const query =
    "DELETE FROM customers WHERE customer_id = $1 RETURNING first_name, last_name";
  try {
    const response = await pool.query(query, [customerId]);
    if (response.rowCount > 0) {
      console.log();
      console.log(
        `Customer ${response.rows[0].first_name} ${response.rows[0].last_name} and their rental history removed from the database`
      );
    } else {
      console.log();
      console.log(`No customer found with ID ${customerId}`);
    }
  } catch (error) {
    console.log();
    console.error("Error removing customer:", error.message);
  }
}

/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log("Usage:");
  console.log("  insert <title> <year> <genre> <director> - Insert a movie");
  console.log("  show - Show all movies");
  console.log("  update <customer_id> <new_email> - Update a customer's email");
  console.log("  remove <customer_id> - Remove a customer from the database");
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2);
  switch (args[0]) {
    case "insert":
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case "show":
      await displayMovies();
      break;
    case "update":
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case "remove":
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }
}

runCLI();
