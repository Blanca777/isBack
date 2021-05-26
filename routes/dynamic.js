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
  let time = new Date()
  let fileName = time.getTime()
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let fileExtension = req.files.file.name.substring(req.files.file.name.lastIndexOf("."))
  let fileReader = fs.createReadStream(req.files.file.path)
  let fileWriter = fs.createWriteStream(path.join(__dirname, '../resources/article', `ad_${fileName}${fileExtension}`));
  fileReader.pipe(fileWriter);
  let { title, authorId, authorName, tag1, tag2 } = req.body
  Article.create({
    articleId: "ad_" + fileName,
    articleTitle: title,
    authorId: authorId,
    authorName: authorName,
    time: `${year}-${month}-${date}`,
    tag: [tag1, tag2],
    viewNum: "0",
    commentList: []
  }, (err, doc) => {
    if (!err) {
      Author.findOneAndUpdate({ authorId: authorId }, {
        $push: {
          articleDynamic: {
            $each: [{
              articleId: "ad_" + fileName,
              dynamicTime: `${year}-${month}-${date}`,
              dynamicText: title
            }],
            $position: 0
          }
        }
      }, (err, doc) => {
        if (!err) {
          console.log('数据库更新成功')
          res.status(200).send('succ')
        } else {
          console.log('数据库更新失败', err)
          res.status(413).send('err')
        }
      })
    } else {
      console.log('数据库更新失败', err)
      res.status(413).send('err')
    }
  })
})
route.post('/addPersonalDynamic', (req, res) => {
  let time = new Date()
  let personalId = time.getTime()
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let data = {
    personalId: 'pd_' + personalId,
    dynamicTime: `${year}-${month}-${date}`,
    dynamicText: req.body.dynamicText
  }
  Author.findOneAndUpdate({ authorId: req.body.authorId }, {
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