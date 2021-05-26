const { DB_URL } = require('./config');
const mongoose = require('mongoose');
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, function () {
  console.log(`已连接数据库${DB_URL}`)
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var article = new mongoose.Schema({
  articleId: String,
  articleTitle: String,
  authorId: String,
  authorName: String,
  time: String,
  viewNum: String,
  tag: Array,
  commentList: Array
});
var author = new mongoose.Schema({
  password: String,
  username: String,
  authorId: String,
  authorName: String,
  authorImg: String,
  articleNum: Number,
  tagNum: Number,
  visiteNum: Number,
  category: Array,
  tag: Array,
  fLink: Array,
  personalDynamic: Array,
  articleDynamic: Array
});
var rank = new mongoose.Schema({
  articleId: String,
  articleTitle: String
});
var Article = mongoose.model('article', article);
var Author = mongoose.model('author', author);
var Rank = mongoose.model('rank', rank);
module.exports = { mongoose, Article, Author, Rank }