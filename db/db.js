const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://done%20it_owner:npg_7aG2SefhEKor@ep-muddy-salad-a1tuw1up-pooler.ap-southeast-1.aws.neon.tech/done%20it?sslmode=require",
  ssl: {
    rejectUnauthorized: false,
  },
});

const errorHandler = (error) => {
  console.error(`[DB ERROR]: ${error.message}`);
  console.error(error);
};

pool.on("error", errorHandler);

const connectDB = async () => {
  try {
    const client = await pool.connect(); // Get a client from the pool
    console.log("Connected to PostgreSQL");
    return client;
  } catch (err) {
    console.error("Connection error", err.stack);
    pool.off("error", errorHandler);
  }
};

const disconnectDB = async () => {
  try {
    await pool.end(); // Close all connections in the pool
    console.log("Disconnected from PostgreSQL");
  } catch (err) {
    console.error("Disconnection error", err.stack);
    pool.off("error", errorHandler);
  }
};

// Export the pool, connect, and disconnect functions

module.exports = {
  pool,
  connectDB,
  disconnectDB,
};
