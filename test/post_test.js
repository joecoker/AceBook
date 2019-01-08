const expect = require('chai').expect;
const Post = require('../lib/post');

describe('Post', function() {

  describe('#create', function() {
    it("adds a post to the post database", function() {

      Post.create("Hello world", 3);

      const results = sequalize.query(
        "SELECT * FROM posts " +
        "WHERE userId=3"
      )

      expect(results.content).equal("Hello world");
      // query the database - sequalize?

    })
  })

})
