const { DB_URL } = require('./config');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)
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
  publishTime: Number,
  viewNum: {
    type: Number,
    default: 0
  },
  tag: Array,
  commentList: Array
});
var author = new mongoose.Schema({
  password: String,
  username: String,
  authorId: String,
  authorName: String,
  authorImg: {
    type: String,
    default: "http://blanca777.cn:1777/author/base/spaceman.png"
  },
  articleNum: {
    type: Number,
    default: 0
  },
  personalNum: {
    type: Number,
    default: 0
  },
  visiteNum: {
    type: Number,
    default: 0
  },
  category: {
    type: Array,
    default: []
  },
  tag: {
    type: Array,
    default: []
  },
  fLink: {
    type: Array,
    default: []
  },
  personalDynamic: {
    type: Array,
    default: []
  },
  articleDynamic: {
    type: Array,
    default: []
  }
});
var channel = new mongoose.Schema({
  speechId: String,
  speechContent: String,
  authorId: String,
  authorName: String,
  publishTime: Number,
  likeNum: {
    type: Number,
    default: 0
  },
  commentList: {
    type: Array,
    default: []
  }
});
var Article = mongoose.model('article', article);
var Author = mongoose.model('author', author);
var Channel = mongoose.model('channel', channel);
module.exports = { mongoose, Article, Author, Channel }