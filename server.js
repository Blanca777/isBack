const express = require('express');
const path = require('path');
const fs = require('fs');

const mongoose = require('./conf/connectDB')
const cors = require('./conf/cors')
const routes = require('./routes');
const bodyParser = require('./conf/bodyParser');

const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();

const app = express();
routes(app);
cors(app);
bodyParser(app)


const musiclist = mongoose.model('musiclist', new mongoose.Schema({
  song: { type: String },
}))


app.listen(1777, function () {
  console.log('node app start at port 1777')
})