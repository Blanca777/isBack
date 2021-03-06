const express = require('express');
const route = express.Router();
const { Article, Author } = require('../conf/connectDB');
const bodyParser = require('../conf/bodyParser');
bodyParser(route);
route.get('/articleList', (req, res) => {
  Article.find({})
  .sort({_id: -1})
  .select('articleId articleTitle tag authorId publishTime authorName')
  .exec((err,data)=>{
    res.status(200).send(data)
  });
})
module.exports = route