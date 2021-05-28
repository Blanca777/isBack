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
route.post('/signup', (req, res) => {
  let { username, password } = req.body
  Author.findOne({ username }, (err, data) => {
    if (err) return 
    if (data === null) {
      Author.create({
        authorId: "a_" + new Date().getTime(),
        authorName: username,
        username,
        password
      },(err,data)=>{
        console.log(data)
        res.status(200).send("注册成功")
      })
    }else {
      res.status(200).send("该用户名已经被注册")
    }
  })
})
module.exports = route