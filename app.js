const express = require('express');
require('dotenv').config();
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser');
const User = require('./lib/user')
const Post = require('./lib/post');
const Comment = require('./lib/comment');
let userId = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/', function(req, res) {
  res.render('index.ejs');
})

app.get('/sign-up', function(req, res) {
  res.render('sign-up.ejs');
})

app.post('/sign-up', async function(req, res) {
  let userDetails = await User.create(req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.dob);
  if (userDetails === false) {
    // Flash message saying user already exists
    res.redirect('/sign-in')
  } else {
    userId = userDetails.userid
    res.redirect('/newsfeed');
  }
})

app.get('/sign-in', function(req, res) {
  res.render('sign-in.ejs');
})

app.post('/sign-in', async function(req, res) {
  let userDetails = await User.signIn(req.body.email, req.body.password);
  if (userDetails === undefined) {
    //Flash message saying check email or create an account
    res.redirect('/sign-in')
  } else if (userDetails === false) {
    // Flash message saying password is incorrect
    res.redirect('/sign-in')
  } else {
    userId = userDetails.userid
    res.redirect('/newsfeed');
  }
})

app.get('/newsfeed', async function(req, res) {
  let posts = await Post.list();
  res.render('newsfeed.ejs', {posts: posts});
})

app.post('/newsfeed', async function(req, res) {
  let postContent = req.body.postContent;
  // let userId = req.body.userId;
  let result = await Post.create(postContent, userId);
  res.redirect('/newsfeed')
})

app.get('/post/:postid', async function(req, res){
  let postId = req.params.postid;
  let post = await Post.getPost(postId);
  let comments = await Comment.list(postId);
  res.render('post.ejs', {post: post, comments: comments, commentCount: comments.length});
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
