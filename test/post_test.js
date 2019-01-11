const expect = require('chai').expect;
const Post = require('../lib/post');
const DatabaseHelpers = require('./database_helpers')

describe('Post', function() {

  before('set database to acebook_dev', async function() {
    await DatabaseHelpers.setDevDatabase();
  })

  afterEach('Truncating dev database', async function (){
    await DatabaseHelpers.truncateDatabase();
  })

  describe('#list', function() {
    it("creates an array of all post objects", async function() {

      await DatabaseHelpers.createPosts();

      let posts = await Post.list();

      expect(posts.rows[0].content).equal("Tiny Rick was here")
      expect(posts.rows[0].firstname).equal("Ben")
      expect(posts.rows[0].lastname).equal("Johnson")
      expect(posts.rows[1].content).equal("Bird Person joined him")
      expect(posts.rows[1].firstname).equal("Ben")
      expect(posts.rows[1].lastname).equal("Johnson")
    })
  })

  describe('#create', function() {
    it("adds a post to the post database", async function() {

      let userId = await DatabaseHelpers.createUser();
      let post = await Post.create("Hello world", userId);

      expect(post.rows[0].content).equal("Hello world");
    })
  })

  after('set database to acebook', async function() {
    await DatabaseHelpers.setLiveDatabase();
  })
})
