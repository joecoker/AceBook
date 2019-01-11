const DatabaseConnection = require('./database_connection')
const dbc = new DatabaseConnection();

class Post {


  static async list() {
    let postList = await dbc.query(`
        SELECT posts.content, posts.createdat, firstname, lastname, posts.postid, COUNT(commentid) AS commentcount
        FROM posts
        LEFT JOIN comments on posts.postid = comments.postid
        INNER JOIN users on posts.userid = users.userid
        GROUP BY posts.postid, firstname, lastname
        ORDER BY posts.createdat DESC;
      `)

    return postList.rows;
}

  static async create(postContent, userId) {
    let result = await dbc.query(`
      INSERT INTO posts (userid, content)
      VALUES ('${userId}', '${postContent}')
      RETURNING postid, content;
      `)
    return result;
  }

  static async getPost(postId){
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
