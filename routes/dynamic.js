const express = require('express');
const route = express.Router();
const { Article, Author } = require('../conf/connectDB');
const fs = require('fs');
const path = require('path');
const bodyParser = require('../conf/bodyParser');
bodyParser(route);
const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();


route.get('/:authorId', (req, res) => {
  Author.findOne({ authorId: req.params.authorId })
    .exec((err, data) => {
      res.status(200).send(data)
    });
})
route.post('/addArticleDynamic', multipartyMiddleware, (req, res) => {
  let articleCreate = new Date()
  let articleId = "ad_" + articleCreate.getTime()
  let publishTime = articleCreate.toLocaleDateString()
  let fileExtension = req.files.file.name.substring(req.files.file.name.lastIndexOf("."))
  let fileReader = fs.createReadStream(req.files.file.path)
  let fileWriter = fs.createWriteStream(path.join(__dirname, '../resources/article', `${articleId}${fileExtension}`));
  fileReader.pipe(fileWriter);
  let { title, authorId, authorName, tag1, tag2 } = req.body
  Article.create({
    articleId,
    articleTitle: title,
    authorId,
    authorName,
    publishTime,
    tag: [tag1, tag2],
    viewNum: "0",
    commentList: []
  }, (err, doc) => {
    if (!err) {
      Author.findOneAndUpdate({ authorId: authorId }, {
        $push: {
          articleDynamic: {
            $each: [{
              articleId,
              dynamicTime: publishTime,
              dynamicText: title
            }],
            $position: 0
          }
        }
      },{new: true},(err, data) => {
        if (err) res.status(413).send('err')
        res.status(201).send(data)
      })
    } else {
      console.log('数据库更新失败', err)
      res.status(413).send('err')
    }
  })
})
route.post('/addPersonalDynamic', (req, res) => {
  let personalCreate = new Date()
  let personalId = 'pd_' + personalCreate.getTime()
  let dynamicTime = personalCreate.toLocaleString()
  let { dynamicText, authorId } = req.body
  let data = {
    personalId,
    dynamicTime,
    dynamicText
  }
  Author.findOneAndUpdate({ authorId }, {
    $push: {
      personalDynamic: {
        $each: [data],
        $position: 0
      }
    }
  }, { new: true }, (err, data) => {
    if (err) return res.status(503).send('err')
    res.status(201).send(data)
  })
})
module.exports = route