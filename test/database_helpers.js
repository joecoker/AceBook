const DatabaseConnection = require('../lib/database_connection')
const dbc = new DatabaseConnection('acebook_dev')

class DatabaseHelpers {

  static async truncateDatabase() {
    await dbc.query('TRUNCATE posts RESTART IDENTITY CASCADE;')
    await dbc.query('TRUNCATE users RESTART IDENTITY CASCADE;')
  }

  static async createUser() {
    let userId = await dbc.query(
      "INSERT INTO users (firstname, lastname) " +
      "VALUES ('Ben', 'Johnson') " +
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
