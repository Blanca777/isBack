const express = require('express');
const route = express.Router();
const { Article, Author } = require('../conf/connectDB');
const fs = require('fs');
const bodyParser = require('../conf/bodyParser');
bodyParser(route);

route.get('/:authorId', (req, res) => {
  Author.findOne({ authorId: req.params.authorId })
  .exec((err,data)=>{
    res.status(200).send(data)
  });
})


module.exports = route