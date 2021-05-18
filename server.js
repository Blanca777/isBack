const express = require('express');
const path = require('path');
const fs = require('fs');

const { port } = require('./conf/config')
const cors = require('./conf/cors')
const routes = require('./routes');


// const multiparty = require('connect-multiparty');
// const multipartyMiddleware = multiparty();

// const multer = require('multer') // v1.0.5
// const upload = multer() // for parsing multipart/form-data

const app = express();
cors(app);
routes(app);



app.listen(1777, function () {
  console.log(`node app start at port http://localhost:${port}`)
})