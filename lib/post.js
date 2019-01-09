const DatabaseConnection = require('./database_connection')
const dbc = new DatabaseConnection

class Post {

static async list() {
    let postList = await dbc.query(
      "SELECT content, posts.createdat, firstname, lastname " +
      "FROM posts " +
      "JOIN users on posts.userid = users.userid;"
    )
    return postList;
}

  static async create(postContent, userId) {
    let result = await dbc.query(`
      INSERT INTO posts (userid, content)
      VALUES ('${userId}', '${postContent}');
      `)
    return result;
  }
}

module.exports = Post;
