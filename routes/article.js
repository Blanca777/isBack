const express = require('express');
const route = express.Router();
const { Article, Author } = require('../conf/connectDB');
const fs = require('fs');
const bodyParser = require('../conf/bodyParser');
bodyParser(route);

route.get('/:articleId', (req, res) => {
  Article.findOneAndUpdate({ articleId: req.params.articleId },{
    $inc: {
      viewNum: 1
    }
  },(err, data) => {
    if(err) res.status(500).send('err')
    res.status(200).send(data)
  })
})
route.get('/md/:articleId', (req, res) => {
  fs.readFile(`./resources/article/${req.params.articleId}.md`, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('err')
    } else {
      res.status(200).send(data)
    }
  });
})
route.get('/author/:authorId', (req, res) => {
  Author.findOne({ authorId: req.params.authorId }, (err, data) => {
    if (err) return
    res.status(200).send(data)
  })

})
route.post('/addComment', (req, res) => {
  const commentCreate = new Date()
  let commentId = "comment_" + commentCreate.getTime()
  let commentDate = commentCreate.toLocaleString()
  let { articleId, authorId, authorName, commentText } = req.body
  const data = {
    commentId: commentId,
    commentAuthorName: authorName,
    commentAuthorId: authorId,
    commentText: commentText,
    commentDate: commentDate,
    replyList: []
  }
  Article.findOneAndUpdate({ articleId: articleId }, {
    $push: {
      commentList: {
        $each: [data],
        $position: 0
      }
    }
  }, { new: true }, (err, data) => {
    if (err) return res.status(503).send('err')
    res.status(201).send(data)
  })

})
route.post('/addReply', (req, res) => {
  const replyCreate = new Date()
  let replyId = "reply_" + replyCreate.getTime()
  let replyDate = replyCreate.toLocaleString()
  let { replyText, authorId, authorName, articleId, commentId } = req.body
  const data = {
    replyId: replyId,
    replyAuthorName: authorName,
    replyAuthorId: authorId,
    replyText: replyText,
    replyDate: replyDate
  }
  Article.findOneAndUpdate({ "commentList.commentId": commentId }, {
    $push: {
      "commentList.$.replyList": {
        $each: [data]
      }
    }
  }, { new: true }, (err, data) => {
    if (err) return res.status(503).send('err')
    res.status(201).send(data)
  })

})

module.exports = route