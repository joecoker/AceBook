require('dotenv').config();

const { Pool } = require('pg');

class DatabaseConnection {

  static async query(string, arg=null) {
    let connection = new Pool({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT
    })
    let result = await connection.query(string, arg)
      .catch(function(err) {
        console.log(err)
      })
    await connection.end();
    return result
  }
}

module.exports = DatabaseConnection;
