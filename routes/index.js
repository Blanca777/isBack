const home = require('./home');
const article = require('./article');
const login = require('./login');
const tag = require('./tag');
const dynamic = require('./dynamic');
const channel = require('./channel');
module.exports = app => {
  app.use('/home', home);
  app.use('/article', article);
  app.use('/login', login);
  app.use('/tag', tag);
  app.use('/dynamic', dynamic);
  app.use('/channel', channel);
}