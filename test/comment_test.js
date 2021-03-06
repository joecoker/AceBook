const expect = require('chai').expect;
const DatabaseHelpers = require('./database_helpers');
const Comment = require('../lib/comment.js')

describe('Comment', function(){

  before('set database to acebook_dev', async function() {
    await DatabaseHelpers.setDevDatabase();
  })

  afterEach('Truncate dev database', async function(){
   await DatabaseHelpers.truncateDatabase();
  })

  describe('#create', function(){
    it('adds a comment to the comment table', async function(){

      let postId = await DatabaseHelpers.createPosts();
      postId = postId[0].postid;

      let userId = await DatabaseHelpers.createUser();

      let comment = await Comment.create("Hi, Tiny Rick!", postId, userId);

      expect(comment.rows[0].content).equal("Hi, Tiny Rick!");
    })
  })

  describe('#list', function(){
    it('returns an array of comments', async function(){

      let postId = await DatabaseHelpers.createPosts();
      postId = postId[0].postid;

      let userId = await DatabaseHelpers.createUser();

      await Comment.create('Test comment 1', postId, userId);
      await Comment.create('Test comment 2', postId, userId);
      await Comment.create('Test comment 3', postId, userId);

      let comments = await Comment.list(postId);

      expect(comments[0].content).equal('Test comment 1');
      expect(comments[1].content).equal('Test comment 2');
      expect(comments[2].content).equal('Test comment 3');

    })
  })

})
