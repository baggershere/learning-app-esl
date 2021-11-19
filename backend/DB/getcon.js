const { Pool } = require("pg");
require("dotenv").config();

const getCon = () => {
  const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
  });
  return pool;
};

module.exports = {
  getCon,
};
