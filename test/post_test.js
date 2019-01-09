const expect = require('chai').expect;
const Post = require('../lib/post');
const DatabaseConnection = require("../lib/database_connection")

describe('Post', function() {

  afterEach('Truncating dev database', function (){
    const database = new DatabaseConnection("acebook_dev")
    database.query('TRUNCATE posts RESTART IDENTITY CASCADE;')
    database.query('TRUNCATE users RESTART IDENTITY CASCADE;')
  })

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

  describe('#list', function() {
    it("creates an array of all post objects", async function() {

      const databaseConnection = new DatabaseConnection("acebook_dev")

      let userId = await databaseConnection.query(
        "INSERT INTO users (firstname, lastname) " +
        "VALUES ('Ben', 'Johnson') " +
        "RETURNING userid;"
      )

      userId = JSON.stringify(userId.rows[0]['userid']);

      await databaseConnection.query(
        "INSERT INTO posts (content, userid) " +
        `VALUES ('Heyy', '${userId}'), ('Life is good yo', '${userId}');`
      )

      const posts = await Post.list();

      expect(posts.rows[0].content).equal("Heyy")
      expect(posts.rows[0].firstname).equal("Ben")
      expect(posts.rows[0].lastname).equal("Johnson")
      expect(posts.rows[1].content).equal("Life is good yo")
      expect(posts.rows[1].firstname).equal("Ben")
      expect(posts.rows[1].lastname).equal("Johnson")
    })
  })


})
