const express = require('express');
require('dotenv').config();
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser');
const Post = require('./lib/post');
const Like = require('./lib/like');
const Comment = require('./lib/comment');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/newsfeed', async function(req, res) {
  let posts = await Post.list();
  res.render('newsfeed.ejs', {posts: posts});
})

app.post('/newsfeed', async function(req, res) {
  let postContent = req.body.postContent;
  let userId = req.body.userId;
  let result = await Post.create(postContent, userId);
  res.redirect('/newsfeed')
})

app.get('/post/:postid', async function(req, res){
  let postId = req.params.postid;
  let post = await Post.getPost(postId);
  let comments = await Comment.list(postId);
  res.render('post.ejs', {post: post, comments: comments, commentCount: comments.length});
})

app.get('/post/like/:postid', async function(req, res){
  let referrer = req.get('Referrer');
  if (referrer === undefined) {
    res.redirect('/newsfeed');
    return;
  }
  let postId = req.params.postid;
  let userId = 1;
  let likeId = await Like.toggleLike(postId, userId);
  res.redirect(referrer);
})

app.post('/comment/:postid', async function(req, res){
  let postId = req.params.postid;
  let commentContent = req.body.commentContent;
  let userId = req.body.userId;
  let result = await Comment.create(commentContent, postId, userId);
  res.redirect('/post/' + postId);
})

app.listen(PORT);
console.log(`Node listening on ${PORT}`);

module.exports = app;
