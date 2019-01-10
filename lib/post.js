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
      RETURNING postid, content;
      `)
    return result;
  }

  static async getPost(postId, database = 'acebook'){
    const dbc = new DatabaseConnection(database)
    let result = await dbc.query(`
      SELECT content, posts.postid, posts.createdat, firstname, lastname
      FROM posts
      JOIN users on posts.userid = users.userid
      WHERE postid = '${postId}';
      `)
    return result.rows[0];
  }
}

module.exports = Post;
