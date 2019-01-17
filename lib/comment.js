const dbc = require('../database_connection');

class Comment{

  static async create(commentContent, postId, userId){
    let result = await dbc.query(
      'INSERT INTO comments (content, postid, userid) '+
      'VALUES ($1, $2, $3) '+
      'RETURNING content;',
      [commentContent, postId, userId])
      return result;
  }

  static async list(postId){
    let result = await dbc.query(
      'SELECT comments.postid, comments.userid, comments.content, ' +
      'comments.createdat, firstname, lastname ' +
      'FROM comments ' +
      'JOIN users on comments.userid = users.userid ' +
      'WHERE postid = $1 '+
      'ORDER BY comments.createdat;',
      [ postId ]);
    return result.rows;
  }
}

module.exports = Comment;
