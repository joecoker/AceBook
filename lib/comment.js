const DatabaseConnection = require('./database_connection');

class Comment{

  static async create(commentContent, postId, userId, database = 'acebook'){
    const dbc = new DatabaseConnection(database)
    let result = await dbc.query(`
      INSERT INTO comments (content, postid, userid)
      VALUES ('${commentContent}', '${postId}', '${userId}')
      RETURNING content;
      `)
      return result;
  }
}

module.exports = Comment;
