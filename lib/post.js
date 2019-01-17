const dbc = require('../database_connection')

class Post {

  static async list(userId) {
    let postList = await dbc.query(
      'SELECT posts.content, posts.createdat, firstname, lastname, posts.postid, posts.userid, ' +
      'COUNT(DISTINCT commentid)::INTEGER AS commentcount, ' +
      'COUNT(DISTINCT likeid)::INTEGER AS likecount, ' +
      "COALESCE((SELECT 'TRUE'::TEXT FROM likes WHERE posts.postid = likes.postid AND likes.userid = $1), 'FALSE'::TEXT)::BOOLEAN as liked " +
      'FROM posts ' +
      'LEFT JOIN comments on posts.postid = comments.postid ' +
      'LEFT JOIN likes on posts.postid = likes.postid ' +
      'INNER JOIN users on posts.userid = users.userid ' +
      'GROUP BY posts.postid, users.firstname, users.lastname ' +
      'ORDER BY posts.createdat DESC;'
      , [userId])

    return postList.rows;
}

static async getUserPosts(userId, posts = 10) {
  let postList = await dbc.query(
    'SELECT posts.content, posts.createdat, firstname, lastname, posts.postid, posts.userid, ' +
    'COUNT(DISTINCT commentid)::INTEGER AS commentcount, ' +
    'COUNT(DISTINCT likeid)::INTEGER AS likecount, ' +
    "COALESCE((SELECT 'TRUE'::TEXT FROM likes WHERE posts.postid = likes.postid AND likes.userid = $1), 'FALSE'::TEXT)::BOOLEAN as liked " +
    'FROM posts ' +
    'LEFT JOIN comments on posts.postid = comments.postid ' +
    'LEFT JOIN likes on posts.postid = likes.postid ' +
    'INNER JOIN users on posts.userid = users.userid ' +
    'WHERE posts.userid = $1 ' +
    'GROUP BY posts.postid, users.firstname, users.lastname ' +
    'ORDER BY posts.createdat DESC ' +
    'LIMIT $2;'
    , [userId, posts])

  return postList.rows;
}

  static async create(postContent, userId) {
    let result = await dbc.query(
      'INSERT INTO posts (userid, content) ' +
      'VALUES ($1, $2) ' +
      'RETURNING postid, content;'
      , [userId, postContent]);
    return result.rows;
  }

  static async getPost(postId, userId){
    let result = await dbc.query(
      'SELECT posts.content, posts.postid, posts.createdat, firstname, lastname, posts.userid, ' +
      'COUNT(DISTINCT commentid)::INTEGER AS commentcount, ' +
      'COUNT(DISTINCT likeid)::INTEGER AS likecount, ' +
      "COALESCE((SELECT 'TRUE'::TEXT FROM likes WHERE posts.postid = likes.postid AND likes.userid = $1), 'FALSE'::TEXT)::BOOLEAN as liked " +
      'FROM posts ' +
      'LEFT JOIN comments on posts.postid = comments.postid ' +
      'LEFT JOIN likes on posts.postid = likes.postid ' +
      'INNER JOIN users on posts.userid = users.userid ' +
      'WHERE posts.postid = $2 ' +
      'GROUP BY posts.postid, posts.content, firstname, lastname;'
      , [userId, postId]);
    return result.rows[0];
  }
}

module.exports = Post;
