"use strict";
require('dotenv').config();
const { Pool, Client } = require('pg')

class DatabaseConnection {
  constructor(database = process.env.PGDATABASE) {
    this.connection = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: database,
      port: process.env.PGPORT})
  }

  async query(string) {
    const result = await this.connection.query(string)
      .catch(function(err) {
        console.log(err);
      })
    return result
  }
}

module.exports = DatabaseConnection
