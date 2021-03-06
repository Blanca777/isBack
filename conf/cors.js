const { corsHost } = require('./config')

module.exports = app => {
  // app.all('*', function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "X-Requested-With");
  //   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  //   res.header("X-Powered-By", ' 3.2.1')
  //   res.header("Content-Type", "application/json;charset=utf-8");
  //   next();
  // });
  //设置跨域请求
  app.all('*', function (req, res, next) {
    //设置请求头
    //允许所有来源访问
    res.header('Access-Control-Allow-Origin', '*')
    //用于判断request来自ajax还是传统请求
    res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
    //允许访问的方式
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    //修改程序信息与版本
    res.header('X-Powered-By', ' 3.2.1')
    //内容类型：如果是post请求必须指定这个属性
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
  })
}