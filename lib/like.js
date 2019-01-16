const DatabaseConnection = require('../database_connection');
const dbc = new DatabaseConnection();
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
    let result = await dbc.query(`
      INSERT INTO likes (postid, userid)
      VALUES ('${postId}', '${userId}')
      RETURNING likeid;
    `);
    return result.rows[0].likeid;
  }

  static async removeLike(postId, userId){
    let result = await dbc.query(`
      DELETE FROM likes
      WHERE postid = '${postId}'
      AND userid = '${userId}';
    `);
    return -1;
  }

  static async checkLike(postId, userId){
    let result = await dbc.query(`
      SELECT *
      FROM likes
      WHERE postid = '${postId}'
      AND userid = '${userId}';
      `)

    return result.rowCount === 1;
  }

}

module.exports = Like;
