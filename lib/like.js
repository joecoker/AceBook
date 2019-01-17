const dbc = require('../database_connection');
class Like{

  static async toggleLike(postId, userId){
    let liked = await Like.checkLike(postId, userId);
    if (liked) {
      return await Like.removeLike(postId, userId);
    } else {
      return await Like.addLike(postId, userId);
    }
  }

  static async addLike(postId, userId){
    let result = await dbc.query(
      'INSERT INTO likes (postid, userid) ' +
      'VALUES ($1, $2) ' +
      'RETURNING likeid;'
      , [postId, userId]);
    return result.rows[0].likeid;
  }

  static async removeLike(postId, userId){
    let result = await dbc.query(
      'DELETE FROM likes ' +
      'WHERE postid = $1 ' +
      'AND userid = $2;'
      , [postId, userId]);
    return -1;
  }

  static async checkLike(postId, userId){
    let result = await dbc.query(
      'SELECT * ' +
      'FROM likes ' +
      'WHERE postid = $1 ' +
      'AND userid = $2;'
    , [postId, userId]);

    return result.rowCount === 1;
  }

}

module.exports = Like;
