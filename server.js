const express = require('express');
const path = require('path');
const fs = require('fs');

const { port } = require('./conf/config')
const cors = require('./conf/cors')
const routes = require('./routes');
const bodyParser = require('./conf/bodyParser');

const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();

const app = express();
routes(app);
cors(app);
bodyParser(app)


app.listen(1777, function () {
  console.log(`node app start at port http://localhost:${port}`)
})