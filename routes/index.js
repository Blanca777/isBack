const home = require('./home');
const article = require('./article');
module.exports = app => {
  app.use('/home', home);
  app.use('/article', article);
}