const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres", // Replace with your PostgreSQL username
//   host: "localhost",
//   database: "doneit", // Replace with your database name
//   password: "Password123$", // Replace with your PostgreSQL password
//   port: 5432,
// });

postgresql://done_it_61xv_user:tgP8MORf4WhWhNGDCFhUUmB0MuMVmXF2@dpg-d0dgd095pdvs7395905g-a.singapore-postgres.render.com/done_it_61xv

// Render server
const pool = new Pool({
  user: "done_it_61xv_user", // Replace with your PostgreSQL username
  host: "dpg-d0dgd095pdvs7395905g-a",
  database: "done_it_61xv", // Replace with your database name
  password: "tgP8MORf4WhWhNGDCFhUUmB0MuMVmXF2", // Replace with your PostgreSQL password
  port: 5432,
});

const connectDB = async () => {
  try {
    const client = await pool.connect(); // Get a client from the pool
    console.log("Connected to PostgreSQL");
    return client;
  } catch (err) {
    console.error("Connection error", err.stack);
    throw err;
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
