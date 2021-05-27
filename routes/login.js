const express = require('express');
const route = express.Router();
const { Article, Author } = require('../conf/connectDB');
const bodyParser = require('../conf/bodyParser');
bodyParser(route);
route.post('/login', (req, res) => {
  let { username, password } = req.body
  Author.findOne({ username, password }, (err, data) => {
    if (err) return
    if (data === null) {
      res.status(200).send({
        loginStatus: "error"
      })
    } else {
      res.status(200).send({
        loginStatus: "success",
        userInfo: data
      })
    }

  })
})
route.post('/longLogin', (req, res) => {
  let { authorId } = req.body
  Author.findOne({ authorId }, (err, data) => {
    if (err) return
    res.status(200).send(data)
  })
})
module.exports = route