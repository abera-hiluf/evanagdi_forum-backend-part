const db = require("../db/dbConfig.js");

async function createTable() {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS userstable (
        userid INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(25) NOT NULL,
        lastName VARCHAR(25) NOT NULL,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // Create questions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS questionstable (
        id INT AUTO_INCREMENT PRIMARY KEY,
        questionid VARCHAR(100) NOT NULL UNIQUE,
        userid INT NOT NULL,
        title VARCHAR(50) NOT NULL,
        description Text NOT NULL,
        tag VARCHAR(20),
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userid) REFERENCES usersTable(userid)
      ) ENGINE=InnoDB
    `);

    // Create answers table
    await db.query(`
      CREATE TABLE IF NOT EXISTS answerstable (
        answerid INT AUTO_INCREMENT PRIMARY KEY,
        questionid VARCHAR(100) NOT NULL,
        userid INT NOT NULL,
        answer Text NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (questionid) REFERENCES questionstable(questionid),
        FOREIGN KEY (userid) REFERENCES userstable(userid)
      ) ENGINE=InnoDB
    `);

    console.log("Tables created successfully.");
    // process.exit(0);
  } catch (error) {
    console.error("Error creating tables:", error.message);
    process.exit(1);
  }
}

module.exports = createTable;
