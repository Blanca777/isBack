const express = require('express');
const route = express.Router();
const { Article } = require('../conf/connectDB')

route.get('/articleList', (req, res) => {
  Article.find({}).sort({ _id: -1 }).exec((err, data) => {
    if (err) return
    res.status(200).send(data)
  })
})
route.get('/rankList', (req, res) => {
  Article.find({})
    .sort({ viewNum: -1 })
    .limit(10)
    .select('articleId articleTitle viewNum authorId')
    .exec((err, data) => {
      if (err) res.status(500).send(err)
      res.status(200).send(data)
    });
})
route.post('/addArticle', (req, res) => {
  let article = new Article({
    articleid: "article4",
    articleTitle: "article4title",
    authorId: "blanca",
    authorName: "blanca",
    time: "2022-5-5",
    tag: ["JS", "日常"]
  })
  article.save((err) => {
    if (err) return err
    console.log('成功创建')
  })
  res.status(201).send('成功创建了一个article')
})
module.exports = route