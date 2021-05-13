const { DB_URL } = require('./config');
const mongoose = require('mongoose');
mongoose.connect(DB_URL)
mongoose.connection.on('connected', function () {
  console.log(`成功连接${DB_URL}`)
})
module.exports = mongoose