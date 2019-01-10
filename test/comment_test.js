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

})
