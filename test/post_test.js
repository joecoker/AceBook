const expect = require('chai').expect;
const Post = require('../lib/post');
const Like = require('../lib/like');
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

      let userId = await DatabaseHelpers.createUser();
      let posts = await Post.list(userId);

      expect(posts[1].content).equal("Bird Person joined him")
      expect(posts[1].firstname).equal("Ben")
      expect(posts[1].lastname).equal("Johnson")
      expect(posts[0].content).equal("Tiny Rick was here")
      expect(posts[0].firstname).equal("Ben")
      expect(posts[0].lastname).equal("Johnson")
    })

    it('Returns the number of likes for a post', async function() {

      let userId = await DatabaseHelpers.createUser();

      let post = await Post.create("Hello world", userId);

      await Like.toggleLike(post.rows[0].postid, userId);

      let posts = await Post.list(userId);

      expect(posts[0].likecount).equal(1);

    })
  })

  describe('#create', function() {
    it("adds a post to the post database", async function() {

      let userId = await DatabaseHelpers.createUser();
      let post = await Post.create("Hello world", userId);

      expect(post.rows[0].content).equal("Hello world");
    })
  })

  describe('#getPost', function() {
    it('retrieves a post by postid', async function(){
      let postId = await DatabaseHelpers.createPosts();
      postId = postId[0].postid;
      let userId = await DatabaseHelpers.createUser();

      let singlePost = await Post.getPost(postId, userId);

      expect(singlePost.postid).equal(postId)
      expect(singlePost.content).equal("Tiny Rick was here")
    })

    it('retrieves the number of likes on a post', async function() {
      let userId = await DatabaseHelpers.createUser();

      let post = await Post.create("Hello world", userId);

      let postId = post.rows[0].postid

      await Like.toggleLike(postId, userId);

      let singlePost = await Post.getPost(postId, userId);

      expect(singlePost.likecount).equal(1)
    })
  })

  describe('#getUserPosts', function() {
    it('retrieves posts for a given userid', async function(){
      let userId = await DatabaseHelpers.createUser();

      for (var loopvar = 0; loopvar <= 15; loopvar++) {
        await Post.create("Post " + loopvar, userId);
      }

      let userPosts = await Post.getUserPosts(userId);

      expect(userPosts.length).equal(10);

      for (var loopvar = 0; loopvar < 10; loopvar++) {
        expect(userPosts[loopvar].content).equal("Post " + (15 - loopvar));
        expect(userPosts[loopvar].userid).equal(userId);
      }

    })
  })

  after('set database to acebook', async function() {
    await DatabaseHelpers.setLiveDatabase();
  })
})
