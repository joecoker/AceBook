const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const moment = require('moment');
require('dotenv').config();

const User = require('./lib/user')
const Post = require('./lib/post');
const Like = require('./lib/like');
const Comment = require('./lib/comment');

const app = express();
const PORT = process.env.PORT || 5000;

let userId = 0;
const sessionStore = new session.MemoryStore;

const DATE_RFC2822 = "ddd, DD MMM YYYY HH:mm:ss ZZ";
const DATE_SHORT = "MMMM Do YYYY";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat',
  store: sessionStore
}));

app.use(function(req, res, next) {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

app.get('/', function(req, res) {
  if (req.session.userId) {
    res.redirect('/newsfeed');
    return;
  }
  res.render('index.ejs');
})

app.get('/sign-up', function(req, res) {
  res.render('sign-up.ejs');
})

app.post('/sign-up', async function(req, res) {
  let userDetails = await User.create(req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.dob);
  if (userDetails === false) {
    req.session.sessionFlash = {
      type: 'sign_in',
      message: 'Email address already in use.'
    }
    res.redirect('/sign-up')
  } else {
    req.session.userId = userDetails.userid
    res.redirect('/newsfeed');
  }
})

app.get('/sign-in', function(req, res) {
  res.render('sign-in.ejs', { sessionFlash: res.locals.sessionFlash });
})

app.post('/sign-in', async function(req, res) {
  let userDetails = await User.signIn(req.body.email, req.body.password);
  if (userDetails === undefined) {
    req.session.sessionFlash = {
      type: 'sign_in',
      message: 'Incorrect email.'
    }
    res.redirect('/sign-in')
  } else if (userDetails === false) {
    // Flash message saying password is incorrect
    req.session.sessionFlash = {
      type: 'sign_in',
      message: 'Password incorrect.'
    }
    res.redirect('/sign-in')
  } else {
    req.session.userId = userDetails.userid;
    res.redirect('/newsfeed');
  }
})

app.get('/newsfeed', async function(req, res) {
  if (!req.session.userId) {
    res.redirect('/');
    return;
  }
  let posts = await Post.list(req.session.userId);
  let userDetails = await User.getProfile(req.session.userId);
  res.render('newsfeed.ejs', {posts: posts, moment: moment, dateLongFormat: DATE_RFC2822, dateShortFormat: DATE_SHORT, userDetails: userDetails, loggedInUser: req.session.userId});
})

app.post('/newsfeed', async function(req, res) {
  let postContent = req.body.postContent;
  let result = await Post.create(postContent, req.session.userId);
  res.redirect('/newsfeed')
})

app.get('/post/:postid', async function(req, res){
  let postId = req.params.postid;
  let post = await Post.getPost(postId, req.session.userId);
  let comments = await Comment.list(postId);
  res.render('post.ejs', {post: post, comments: comments, commentCount: comments.length, moment: moment, dateLongFormat: DATE_RFC2822});
})

app.get('/post/like/:postid', async function(req, res){
  let referrer = req.get('Referrer');
  if (referrer === undefined) {
    res.redirect('/newsfeed');
    return;
  }
  let postId = req.params.postid;
  let likeId = await Like.toggleLike(postId, req.session.userId);
  res.redirect(referrer);
})

app.post('/comment/:postid', async function(req, res){
  let postId = req.params.postid;
  let commentContent = req.body.commentContent;
  let result = await Comment.create(commentContent, postId, req.session.userId);
  res.redirect('/post/' + postId);
})

app.get('/user/:userid', async function(req, res){
  let userIdProfile = req.params.userid;
  let userDetails = await User.getProfile(userIdProfile);
  let posts = await Post.getUserPosts(userIdProfile);
  res.render('profile.ejs', {userDetails: userDetails, posts: posts, moment: moment, dateLongFormat: DATE_RFC2822, dateShortFormat: DATE_SHORT, loggedInUser: req.session.userId});
})

app.get('/user/edit/:userid', async function(req, res){
  let userDetails = await User.getProfile(req.session.userId);
  res.render('edit-profile.ejs', {userDetails: userDetails});
})

app.post('/user/update/:userid', async function(req, res){
  let userDetails = await User.updateProfile(req.params.userid, req.body.firstName, req.body.lastName, req.body.email, req.body.dob, req.body.profilepictureurl);
  res.redirect('/user/' + userDetails.userid);
})

app.get('/logout', async function(req, res){
  req.session.destroy();
  res.redirect('/');
})

app.listen(PORT);
console.log(`Node listening on ${PORT}`);

module.exports = app;
