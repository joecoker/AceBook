const DatabaseConnection = require('../lib/database_connection')
const dbc = new DatabaseConnection('acebook_dev')
const bcrypt = require('bcrypt');

class DatabaseHelpers {

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

    await dbc.query(
      "INSERT INTO posts (content, userid) " +
      `VALUES ('Tiny Rick was here', '${userId}'), ('Bird Person joined him', '${userId}');`
    )
  }
}

module.exports = DatabaseHelpers;
