const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

const connectDB = async () => {
  try {
    const client = await pool.connect(); // Get a client from the pool
    console.log("Connected to PostgreSQL");
    return client;
  } catch (err) {
    console.error("Connection error", err.stack);
  }
};

const disconnectDB = async () => {
  try {
    await pool.end(); // Close all connections in the pool
    console.log("Disconnected from PostgreSQL");
  } catch (err) {
    console.error("Disconnection error", err.stack);
  }
};

// Export the pool, connect, and disconnect functions

module.exports = {
  pool,
  connectDB,
  disconnectDB,
};
