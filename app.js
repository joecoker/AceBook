const express = require('express');
require('dotenv').config();
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser')
const Post = require('./lib/post')
const User = require('./lib/user')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/', function(req, res) {
  res.render('index.ejs');
})

app.get('/sign-up', function(req, res) {
  res.render('sign-up.ejs');
})

app.post('/sign-up', async function(req, res) {
  const userDetails = await User.create(req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.dob);
  if (userDetails === false) {
    // Flash message saying user already exists
    res.redirect('/sign-in')
  } else {
    res.redirect('/newsfeed', {userDetails: userDetails});
  }
})

app.get('/sign-in', function(req, res) {
  res.render('sign-in.ejs');
})

app.get('/sign-in', async function(req, res) {
  const userDetails = await User.signIn(req.body.email, req.body.password);

})


app.get('/newsfeed', async function(req, res) {
  let posts = await Post.list();
  res.render('newsfeed.ejs', {posts: posts.rows});
})

app.post('/newsfeed', async function(req, res) {
  let postContent = req.body.postContent;
  let userId = req.body.userId;
  let result = await Post.create(postContent, userId);
  res.redirect('/newsfeed')
})

app.listen(PORT);
console.log(`Node listening on ${PORT}`);

module.exports = app;
