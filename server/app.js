const Koa = require('koa')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')

const app = new Koa()

const goodRouter = require('./routes/goods')
const userRouter = require('./routes/users')

mongoose.connect('mongodb://127.0.0.1:27017/dumall', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error.'))
db.once('open', function () {
    console.log('connection success.')
})


app.use(async (ctx, next) => {
    console.log(`${ctx.request.method},${ctx.request.url}`)
    await next()
})

app.use(bodyParser())

app.use(async (ctx, next) => {
    const userId = ctx.cookies.get('userId')
    const url = ctx.request.originalUrl
    if (userId) {
        await next()
    } else {
        if ( url === '/users/login' || url === '/users/logout' || url.indexOf('/goods/list') > -1) {
            await next()
        } else {
            ctx.body = {
                status: '10001',
                msg: '未登录',
                result: ''
            }
        }
    }
})

app.use(goodRouter.routes())
app.use(userRouter.routes())

app.listen(3000)
console.log('app started at port 3000!')