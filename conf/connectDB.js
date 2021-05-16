const { DB_URL } = require('./config');
const mongoose = require('mongoose');
mongoose.connect(DB_URL)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('connected', function () {
  console.log(`已连接数据库${DB_URL}`)
})

var article = new mongoose.Schema({
  articleid: String,
  articleTitle: String,
  authorId: String,
  authorName: String,
  time: String,
  tag: Array
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
  articleDynamic: Array,
  personalDynamic: Array
});
var rankArticle = new mongoose.Schema({
  articleId: String,
  articleTitle: String
});
var Article = mongoose.model('article', article);
var Author = mongoose.model('author', author);
var RankArticle = mongoose.model('rankarticle', rankArticle);
module.exports = {mongoose,Article,Author,RankArticle}