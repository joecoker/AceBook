const expect = require('chai').expect;
const DatabaseHelpers = require('./database_helpers')
const dbc = require('../database_connection')
const Like = require('../lib/like')

describe('Like', function(){

  before('set database to acebook_dev', async function() {
    await DatabaseHelpers.setDevDatabase();
  })

  afterEach('Truncating dev database', async function (){
    await DatabaseHelpers.truncateDatabase();
  })

  describe('#toggleLike', function(){
    it('can like a post', async function(){

      let postId = await DatabaseHelpers.createPosts();
      postId = postId[0].postid;

      let userId = await DatabaseHelpers.createUser();

      let likeId = await Like.toggleLike(postId, userId);

      let result = await dbc.query(`
        SELECT *
        FROM likes
        WHERE likeid = '${likeId}';
        `);

      result = result.rows[0];

      expect(result.postid).equal(postId);
      expect(result.userid).equal(userId);

    })

    it('can unlike a post', async function(){

      let postId = await DatabaseHelpers.createPosts();
      postId = postId[0].postid;

      let userId = await DatabaseHelpers.createUser();

      let likeId1 = await Like.toggleLike(postId, userId);
      let likeId2 = await Like.toggleLike(postId, userId);

      let result = await dbc.query(`
        SELECT *
        FROM likes
        WHERE likeid = '${likeId1}';
        `);

      expect(likeId2).equal(-1);
      expect(result.rowCount).equal(0);

    })

  })

})
