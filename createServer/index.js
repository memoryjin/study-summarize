const http = require('http'),
      url = require('url'),
      path = require('path'),
      fs = require('fs'),
      MIME = require('./MIME.js').type,
      zlib = require('zlib')

const STATIC_PATH = './public'
const Expires = {
  fileMatch: /^(gif|png|jpg|js|css|json)$/ig,
  maxAge: 365 * 24 * 60 * 60
}

const app = http.createServer((req, res) => {
  const pathName = url.parse(req.url).pathname || '',
        realPath = path.join(STATIC_PATH, path.normalize(pathName.replace(/\.\./g, '')))

  const hasFile = function (path) {
    return new Promise((resolve, reject) => {
      fs.exists(path, exists => {
        if (!exists) {
          res.writeHead(404, {'Content-Type': 'text/plain'})
          res.write(`<h2>Not Found</h2>`)
          res.end()
          reject()
        } else {
          resolve()
        }
      })
    })
  }
  const readFile = function (path, type) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, type, (err, file) => {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'})
          res.end(err)
          reject()
        } else {
          resolve(file)
        }
      })
    })
  }

  const output = function (file) {
    // res header增加Cache-Control和Expires信息
    let extName = path.extname(realPath)
    extName = extName ? extName.slice(1) : ''
    const contentType = MIME[extName] || 'text/plain'
    if (extName.match(Expires.fileMatch)) {
      const expires = new Date()
      console.log('use cache')
      expires.setTime(expires.getTime() + Expires.maxAge * 1000)
      res.setHeader('Expires', expires.toUTCString())
      res.setHeader('Cache-Control', `max-age=${Expires.maxAge}`)
    }

    // res header增加Last-Modified信息
    const stat = fs.statSync(realPath)
    const lastModified = stat.mtime.toUTCString()
    res.setHeader('Last-Modified', lastModified)

    // 判断缓存是否有效
    if (req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']) {
      res.writeHead(304, 'Not Modified')
      res.end()
      return
    }

    // 输出响应文件
    const raw = fs.createReadStream(realPath)
    const acceptEncoding = req.headers['accept-encoding'] || ''
    if (acceptEncoding.match(/\bdeflate\b/)) {
      res.writeHead(200, {'Content-Encoding': 'deflate', 'Content-Type': contentType})
      raw.pipe(zlib.createDeflate()).pipe(res)
    } else if (acceptEncoding.match(/\bgzip\b/)) {
      res.writeHead(200, {'Content-Encoding': 'gzip', 'Content-Type': contentType})
      raw.pipe(zlib.createGzip()).pipe(res)
    } else {
      res.writeHead(200, {'Content-Type': contentType})
      raw.pipe(res)
    }
  }

  const run = async function () {
    await hasFile(realPath)
    const file = await readFile(realPath, 'binary')
    output(file)
  }
  run()
})

app.listen(9090)