## 缓存策略

### 一.强制缓存

什么是强制缓存：**不向服务端去请求资源，而是直接在浏览器中获取资源，强制缓存主要有一下两种**

### 1.cache-control

当我们初次请求服务器去获取资源的时候，经过下面几步

浏览器会告诉我们，我这里没有你想要的缓存，你去找服务器要把。

浏览器向服务器请求资源，服务器返回资源的同时，并且在响应头上设置代表强制缓存的缓存头以及缓存的选项。服务起代码参考如下:

```js
const http = require('http')
const fs = require('fs')
 
http.createServer(function (request, response) {
  if (request.url === '/get') {
    const html = fs.readFileSync('test.html', 'utf8')
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.end(html)
  }
 
  if (request.url === '/user/list') {
    response.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Cache-Control': 'max-age=100' // 浏览器缓存时间,
    })
    response.end('console.log("script loaded twice")')
  }
}).listen(3000)

```



那么返回到资源返回到浏览器后，浏览器则会根据缓存策略，进行强制缓存。

### 2.Expires

缓存过期时间，指定所获取资源的到期时间，时间是指服务端的具体时间点

所以，**如果修改了本地时间，可能会导致缓存失效.**



### 两者对比：

其实这两者差别不大，区别就在于 Expires 是http1.0的产物，Cache-Control是http1.1的产物， **两者同时存在的话，Cache-Control优先级高于Expires**；在某些不支持HTTP1.1的环境下，Expires就会发挥用处。所以Expires其实是过时的产物，现阶段它的存在只是一种兼容性的写法。 强缓存判断是否缓存的依据来自于是否超出某个时间或者某个时间段，而不关心服务器端文件是否已经更新，这可能会导致加载文件不是服务器端最新的内容， **那我们如何获知服务器端内容是否已经发生了更新呢**？此时我们需要用到协商缓存策略。

### 二、协商缓存

什么是协商缓存：**在强制缓存失效后，服务器会携带标识去请示服务器是不是需要用缓存，如果服务器同意使用缓存，则返回304，浏览器使用缓存。**如资源已经更新，服务端不同意使用缓存，则会将更新的资源和标识返回给浏览器并返回200。

### 1.last-modified 和 if-modified-since

当第一次请求服务端的时候，服务端会在响应头上加上

```last-modified:Wed, 22 May 2019 03:53:42 GMT```

If-Modified-Since是标准的HTTP请求头标签，在发送HTTP请求时，把**浏览器端缓存页面的最后修改时间**一起发到服务器去，服务器会把这个时间与服务器上实际文件的最后修改时间进行比较。

- **如果时间一致，那么返回HTTP状态码304（不返回文件内容），客户端接到之后，就直接把本地缓存文件显示到浏览器中。**
- **如果时间不一致，就返回HTTP状态码200和新的文件内容，客户端接到之后，会丢弃旧文件，把新文件缓存起来，并显示到浏览器中。**

所以，last-modified 有一些弊端

1. 浏览器无法确定什么样的行为叫做修改，如果，只是打开了本地缓存文件，浏览器还是会造成 Last-Modified 被修改，服务端不能命中缓存导致发送相同的资源。返回资源
2. 因为 Last-Modified 只能以秒计时，如果在不可感知的时间内修改完成文件，那么服务端会认为资源还是命中了，不会返回正确的资源。

### 2.ETag和If-None-Match

为了解决上面的问题，变有了etag和if-none-match

**Etag是服务器生成的，返回的是一个唯一标识，只要能证明这个资源文件唯一不变均可。只有资源内容有变化，则Etag就会重新生成**。浏览器在下一次加载资源向服务器发送请求时，会将上一次返回的Etag值放到request header里的If-None-Match里，服务器只需要比较客户端传来的If-None-Match跟自己服务器上该资源的ETag是否一致，就能很好地判断资源相对客户端而言是否被修改过了。如果服务器发现ETag匹配不上，那么直接以常规GET 200回包形式将新的资源（当然也包括了新的ETag）发给客户端；如果ETag是一致的，则直接返回304知会客户端直接使用本地缓存即可。



### 3.两者对比

- 第一在精确度上，Etag要优于Last-Modified。

- 第二在性能上，Etag要逊于Last-Modified，毕竟Last-Modified只需要记录时间，而Etag需要服务器通过算法来计算出一个hash值。
- 第三在优先级上，服务器校验优先考虑Etag