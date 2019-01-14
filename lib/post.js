const DatabaseConnection = require('./database_connection')
const dbc = new DatabaseConnection();

class Post {


  static async list(userId) {
    let postList = await dbc.query(`
      SELECT posts.content, posts.createdat, firstname, lastname, posts.postid,
      COUNT(DISTINCT commentid)::INTEGER AS commentcount,
      COUNT(DISTINCT likeid)::INTEGER AS likecount,
      COALESCE((SELECT 'TRUE' FROM likes WHERE posts.postid = likes.postid AND likes.userid = ${userId}), 'FALSE')::BOOLEAN as liked
      FROM posts
      LEFT JOIN comments on posts.postid = comments.postid
      LEFT JOIN likes on posts.postid = likes.postid
      INNER JOIN users on posts.userid = users.userid
      GROUP BY posts.postid, users.firstname, users.lastname
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

  static async getPost(postId, userId){
    let result = await dbc.query(`
      SELECT content, posts.postid, posts.createdat, firstname, lastname,
      COUNT(DISTINCT likeid)::INTEGER AS likecount,
      COALESCE((SELECT 'TRUE' FROM likes WHERE posts.postid = likes.postid AND likes.userid = ${userId}), 'FALSE')::BOOLEAN as liked
      FROM posts
      LEFT JOIN likes on posts.postid = likes.postid
      INNER JOIN users on posts.userid = users.userid
      WHERE posts.postid = '${postId}'
      GROUP BY posts.postid, content, firstname, lastname;
      `)
    return result.rows[0];
  }
}

module.exports = Post;
