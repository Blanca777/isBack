const express = require('express');
const route = express.Router();

route.get('/:id', (req, res) => {
  console.log(req.params.id)
  res.status(201).send('这是你发过来的id'+req.params.id)
})

module.exports = route