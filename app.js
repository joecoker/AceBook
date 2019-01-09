const express = require('express');
require('dotenv').config();
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser')
const Post = require('./lib/post')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

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
