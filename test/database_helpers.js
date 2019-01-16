const DatabaseConnection = require('../lib/database_connection')
process.env.PGDATABASE = "acebook_dev";
process.env.PGUSER="";
process.env.PGPASSWORD="";
process.env.PGHOST="";
const dbc = new DatabaseConnection()
const bcrypt = require('bcrypt');

class DatabaseHelpers {

  static setDevDatabase() {
    process.env.PGDATABASE = "acebook_dev",
    process.env.PGUSER="",
    process.env.PGPASSWORD="",
    process.env.PGHOST=""
    return
  }

  static async truncateDatabase() {
    await dbc.query('TRUNCATE posts RESTART IDENTITY CASCADE;')
    await dbc.query('TRUNCATE users RESTART IDENTITY CASCADE;')
  }

  static async createUser() {
    const saltRounds = 10;

    let encryptedPw = bcrypt.hashSync('steroids', saltRounds);

    let userId = await dbc.query(
      "INSERT INTO users (firstname, lastname, email, password, dob) " +
      `VALUES ('Ben', 'Johnson', 'ben@johnson.com', '${encryptedPw}', '1993-04-23') ` +
      "RETURNING userid;"
    );
  return userId.rows[0].userid;
  }

  static async createPosts() {

    let userId = await this.createUser();

    let postId = await dbc.query(
      "INSERT INTO posts (content, userid) " +
      `VALUES ('Tiny Rick was here', '${userId}'), ('Bird Person joined him', '${userId}') ` +
      'RETURNING postId;'
    )

    return postId.rows;
  }
}

module.exports = DatabaseHelpers;
