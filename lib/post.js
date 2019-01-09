const DatabaseConnection = require('./database_connection')
const dbc = new DatabaseConnection

class Post {

  static async create(postContent, userId) {
    let result = await dbc.query(`
      INSERT INTO posts (userid, content)
      VALUES ('${userId}', '${postContent}');
      `)
    return result;
  }
}

module.exports = Post;
