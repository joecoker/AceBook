const expect = require('chai').expect;
const Post = require('../lib/post');
const DatabaseConnection = require("../lib/database_connection")

describe('Post', function() {

  // describe('#create', function() {
  //   it("adds a post to the post database", function() {
  //
  //     Post.create("Hello world", 3);
  //
  //     const results = sequalize.query(
  //       "SELECT * FROM posts " +
  //       "WHERE userId=3"
  //     )
  //
  //     expect(results.content).equal("Hello world");
  //     // query the database - sequalize?
  //
  //   })
  // })

  describe('#view', function() {
    it("creates an array of all post objects", async function() {

      const databaseConnection = new DatabaseConnection("acebook_dev")

      const userId = await databaseConnection.query(
        "INSERT INTO users (firstname, lastname) " +
        "VALUES ('Ben', 'Johnson') " +
        "RETURNING userid;"
      )

      await databaseConnection.query(
        "INSERT INTO posts (content, userid) " +
        `VALUES ('Heyy', '${userId}'), ('Life is good yo', '${userId}');`
      )

      const posts = await Post.view();

      console.log(posts);

      expect(posts[0].content).equal("Heyy")
      expect(posts[1].content).equal("Life is good yo")

    })
  })


})
