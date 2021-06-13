const express = require('express');
const route = express.Router();
const { Channel } = require('../conf/connectDB')

route.get('/speechList', (req, res) => {
  Channel.find({})
  .exec((err, data) => {
    if (err) return
    res.status(200).send(data)
  })
})

module.exports = route