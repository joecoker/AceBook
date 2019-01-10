const expect = require('chai').expect;
const DatabaseHelpers = require('./database_helpers');
const Comment = require('../lib/comment.js')

describe('Comment', function(){

  afterEach('Truncate dev database', async function(){
   await DatabaseHelpers.truncateDatabase();
  })

  describe('#create', function(){
    it('adds a comment to the comment table', async function(){

      let postId = await DatabaseHelpers.createPosts();
      postId = postId[0].postid;

      let userId = await DatabaseHelpers.createUser();

      let comment = await Comment.create("Hi, Tiny Rick!", postId, userId, 'acebook_dev');

      expect(comment.rows[0].content).equal("Hi, Tiny Rick!");
    })
  })

  describe('#list', function(){
    it('returns an array of comments', async function(){

      let postId = await DatabaseHelpers.createPosts();
      postId = postId[0].postid;

      let userId = await DatabaseHelpers.createUser();

      await Comment.create('Test comment 1', postId, userId, 'acebook_dev');
      await Comment.create('Test comment 2', postId, userId, 'acebook_dev');
      await Comment.create('Test comment 3', postId, userId, 'acebook_dev');

      let comments = await Comment.list(postId, 'acebook_dev');

      expect(comments.rows[0].content).equal('Test comment 1');
      expect(comments.rows[1].content).equal('Test comment 2');
      expect(comments.rows[2].content).equal('Test comment 3');

    })
  })

})
