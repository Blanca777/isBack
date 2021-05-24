const express = require('express');
const route = express.Router();
const { Article, Author } = require('../conf/connectDB');
const fs = require('fs');
const bodyParser = require('../conf/bodyParser');
bodyParser(route);

route.get('/:articleId', (req, res) => {
  Article.findOne({ articleId: req.params.articleId }, (err, data) => {
    if (err) return
    res.status(200).send(data)
  })
})
route.get('/md/:articleId', (req, res) => {
  fs.readFile(`./resources/article/${req.params.articleId}.md`, 'utf-8', (err, data) => {
    if (err) return console.log(err)
    res.status(200).send(data)
  });
})
route.get('/author/:authorId', (req, res) => {
  Author.findOne({ authorId: req.params.authorId }, (err, data) => {
    if (err) return
    res.status(200).send(data)
  })

})
route.post('/addComment', (req, res) => {
  const id = new Date().getTime()
  let { articleId, authorId, authorName, commentText } = req.body
  const data = {
    commentArticleId: articleId,
    commentId: "comment" + id,
    commentAuthorName: authorName,
    commentAuthorId: authorId,
    commentText: commentText,
    replyList: []
  }
  Article.updateOne({ articleId: articleId }, {
    $push: {
      commentList: {
        $each: [data],
        $position: 0
      }
    }
  }, (err, data) => {
    if (err) return res.status(503).send('err')
    Article.findOne({ articleId: articleId }, (err, data) => {
      if (err) return res.status(201).send('重新刷新页面')
      res.status(201).send(data)
    })
  })

})

module.exports = route