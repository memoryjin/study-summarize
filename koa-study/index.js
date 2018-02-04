const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const koaBody = require('koa-body')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const bodyConfig = {
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'uploads'),
    keepExtensions: true
  }
}
app.use(koaBody(bodyConfig))

function publicPath (url) {
  return path.join(__dirname, 'public', url)
}

router
  .get('/', (ctx, next) => {
    const file = fs.readFileSync(publicPath('index.html'))
    ctx.type = 'text/html; charset=utf-8'
    ctx.status = 200
    ctx.body = file
    next()
  })
  .post('/upload', (ctx, next) => {
    const body = ctx.request.body
    ctx.body = body
    const content = JSON.stringify(body, null, 2)
    if (fs.existsSync('./result.json')) {
      fs.unlinkSync('./result.json')
    }
    fs.appendFileSync('./result.json', content)
    fs.renameSync(body.files.file.path, `./uploads/${body.files.file.name}`)
    next()
  })

app
  .use(router.routes())
  .use(router.allowedMethods())

app.use(ctx => {
  if (ctx.status === 404) {
    ctx.type = 'text/html; charset=utf-8'
    ctx.body = '<h2>Not Found</h2>'
  }
})

app.listen(3000, () => {
  console.log('server started')
})
