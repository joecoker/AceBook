const express = require('express');
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser')

app.get('/newsfeed', function(req, res) {
  res.render('newsfeed.ejs', { posts : Post.list();});
})

app.post('/newsfeed', async function(req, res) {
  const postContent = req.body.postContent;
  const userId = req.body.userId;
  await Post.create(postContent, userId);
  res.redirect('/newsfeed')
})

app.listen(PORT);
console.log(`Node listening on ${PORT}`);

module.exports = app;
