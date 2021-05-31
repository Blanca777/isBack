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
  Author.findOneAndUpdate({ authorId: req.params.authorId }, {
    $inc: {
      visiteNum: 1
    }
  }, (err, data) => {
    if (err) res.status(500).send('err')
    res.status(200).send(data)
  })
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
  let tag
  if (tag1 === "语言" && tag2 === "类别") {
    tag = []
  } else if (tag1 === "语言" && tag2 !== "类别") {
    tag = [tag2]
  } else if (tag1 !== "语言" && tag2 === "类别") {
    tag = [tag1]
  } else if (tag1 !== "语言" && tag2 !== "类别") {
    tag = [tag1, tag2]
  }
  Article.create({
    articleId,
    articleTitle: title,
    authorId,
    authorName,
    publishTime,
    tag,
    commentList: []
  }, (err, doc) => {
    if (err) res.status(413).send(err)
    Author.findOneAndUpdate({ authorId: authorId }, {
      $inc: {
        articleNum: 1
      },
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
    }, { new: true }, (err, data) => {
      if (err) res.status(500).send(err)
      tag.map((item, index) => {
        Author.findOneAndUpdate({ authorId: authorId, "category.categoryName": item }, {
          $inc: {
            "category.$.articleNum": 1
          }
        }, { new: true }, (err, data) => {
          if (err) res.status(500).send(err)
          if (data == null) {
            Author.findOneAndUpdate({ authorId: "blanca" }, {
              $push: {
                category: {
                  $each: [{
                    categoryName: item,
                    articleNum: 1
                  }]
                }
              }
            }, { new: true }, (err, data) => {
              if (err) res.status(500).send(err)
              if (index === tag.length - 1) {
                console.log(data)
                res.status(200).send(data)
              }
            })
          }
          res.status(200).send(data)
        })
      });
    })
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
    $inc: {
      personalNum: 1
    },
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