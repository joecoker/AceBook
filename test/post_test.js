const expect = require('chai').expect;
const Post = require('../lib/post');
const DatabaseConnection = require('../lib/database_connection')
const dbc = new DatabaseConnection


describe('Post', function() {

  describe('#create', function() {
    it("adds a post to the post database", async function() {

      await Post.create("Hello world", 1);

      let results = await dbc.query(
        "SELECT * FROM posts " +
        "WHERE userId=1"
      )

      expect(results.rows[0].content).equal("Hello world");

    })
  })

})
