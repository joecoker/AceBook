const DatabaseConnection = require('./database_connection')

class Post {

  static async list(database = 'acebook') {
    const dbc = new DatabaseConnection(database)
    let postList = await dbc.query(
      "SELECT content, posts.createdat, firstname, lastname " +
      "FROM posts " +
      "JOIN users on posts.userid = users.userid;"
    )
    return postList;
}

  static async create(postContent, userId, database = 'acebook') {
    const dbc = new DatabaseConnection(database)
    let result = await dbc.query(`
      INSERT INTO posts (userid, content)
      VALUES ('${userId}', '${postContent}')
      RETURNING content;
      `)
    return result;
  }
}

module.exports = Post;
