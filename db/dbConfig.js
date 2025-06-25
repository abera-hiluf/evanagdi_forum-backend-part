const mysql = require("mysql2/promise");
const dbCon = mysql.createPool({
  //database connection details by dotenv
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

module.exports = dbCon;
