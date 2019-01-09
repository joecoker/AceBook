const DatabaseConnection = require("./database_connection")
const dbc = new DatabaseConnection

class Post {

  static create() {

  }

  static async list() {
    let postList = await dbc.query(
      "SELECT content, posts.createdat, firstname, lastname " +
      "FROM posts " +
      "JOIN users on posts.userid = users.userid;"
    )
    return postList;
  }
}

module.exports = Post;
