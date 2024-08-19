const { Pool } = require("pg");
require("dotenv").config();

const environment = process.env.ENVIRONMENT || "local";
const connectionString = environment === 'prod'
    ? process.env.PROD_DATABASE_URL
    : process.env.LOCAL_DATABASE_URL;

module.exports = new Pool({ connectionString });