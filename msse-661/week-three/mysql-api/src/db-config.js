const mysql = require('mysql');
const queries = require('./queries/tasks.queries');

// Get the Host from Environment or use default
const host = process.env.DB_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.DB_USER || 'root';

// Get the Password for DB from Environment or use default
const password = process.env.DB_PASS || 'root';

// Get the Database from Environment or use default
//const database = process.env.DB_DATABASE || 'demo';

// Step 1: Create the connection without specifying database
const con = mysql.createConnection({
  host,
  user,
  password
});

// Step 2: Connect to MySQL server
con.connect(function (err) {
  if (err) throw err;
  console.log('Connected to MySQL server!');

  // Step 3: Create a new database named "demo1"
  const newDatabase = 'demo1'; // Define the new database name
  con.query(`CREATE DATABASE IF NOT EXISTS ${newDatabase}`, function (err, result) {
    if (err) throw err;
    console.log(`Database "${newDatabase}" created or already exists!`);

    // Step 4: Switch to the newly created database
    con.changeUser({ database: newDatabase }, function (err) {
      if (err) throw err;
      console.log(`Switched to database "${newDatabase}"`);

      // Step 5: Create the tasks table (or ensure it exists)
      con.query(queries.CREATE_TASKS_TABLE, function (err, result) {
        if (err) throw err;
        console.log('Table created or exists already!');
      });
    });
  });
});

module.exports = con;