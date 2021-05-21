const home = require('./home');
const article = require('./article');
const login = require('./login');
module.exports = app => {
  app.use('/home', home);
  app.use('/article', article);
  app.use('/login', login);
}