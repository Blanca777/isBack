const express = require('express');
const route = express.Router();
const { Article, Author } = require('../conf/connectDB');
const bodyParser = require('../conf/bodyParser');
bodyParser(route);
route.post('/login', (req, res) => {
  let { username, password } = req.body
  console.log(username, password)
  Author.findOne({ username, password }, (err, data) => {
    if (err) return
    if (data === null) {
      res.status(200).send(data)
    } else {
      res.status(201).send(data)
    }

  })
})
module.exports = route