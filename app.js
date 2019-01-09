const express = require('express');
require('dotenv').config();
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser')
const Post = require('./lib/post')
const DatabaseConnection = require('./lib/database_connection')

dbc = new DatabaseConnection();

async function test() {
    console.log(dbc);
    testvalue = await dbc.query('SELECT * FROM users');
    console.log(testvalue.rows);
   }

test();

app.use(express.static('public'))

app.get('/newsfeed', function(req, res) {
  res.render('newsfeed.ejs');
  // { posts : Post.list()});
})

app.post('/newsfeed', async function(req, res) {
  const postContent = req.body.postContent;
  const userId = req.body.userId;
  await Post.create(postContent, userId);
  res.redirect('/newsfeed')
})

app.get('/test', function(req, res) {

})

app.listen(PORT);
console.log(`Node listening on ${PORT}`);

module.exports = app;
