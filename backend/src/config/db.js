const { Pool } = require("pg");
require("dotenv").config();

// Pool = a collection of database connections
// Instead of opening/closing connection every time,
// Pool keeps connections ready — much faster!
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test connection when server starts
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully!");
    release(); // release connection back to pool
  }
});

module.exports = pool;
