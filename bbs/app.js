const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
// const cors = require('cors')

const path = require('path')

const { log } = require('./utils')
const { secretKey } = require('./config')

// 先初始化一个 express 实例
const app = express()

const configureApp = () => {
    app.use(bodyParser.urlencoded({
        extended: false,
        // extended: true,
    }))

    app.use(cookieParser())

    // app.use(csrf({ cookie: true }))

    app.use(bodyParser.json())

    app.use(session({
        secret: secretKey
    }))

// app.use(cors())

    configureTemplate()

    app.use((request, response, next) => {
        response.locals.flash = request.session.flash
        delete request.session.flash
        next()
    })

    const asset = path.join(__dirname, 'static')
    app.use('/static', express.static(asset))

    registerRoutes()
}

const configureTemplate = () => {
    const env = nunjucks.configure('templates', {
        autoescape: true,
        express: app,
        noCache: true,
    })

    const { formattedTime, formattedTimeAgo } = require('./filter/formatted_time')
    // nunjucks 添加自定义的过滤器
    env.addFilter('formattedTime', (ts) => {
        const s = formattedTime(ts)
        return s
    })

    env.addFilter('formattedTimeAgo', (ts) => {
        // 引入自定义的过滤器, 过滤器就是一个自定义的函数,
        // nunjucks 可以用来处理数据
        const s = formattedTimeAgo(ts)
        return s
    })
}

const registerRoutes = () => {
    // 引入路由文件
    const index = require('./routes/index')
    const topic = require('./routes/topic')
    const reply = require('./routes/reply')
    const { user } = require('./routes/user')
    const { board } = require('./routes/board')
    const { mail } = require('./routes/mail')
    const searcher = require('./routes/search')
    const apiTopic = require('./api/topic')
    const apiUser= require('./api/user')
    // 注册路由
    app.use('/', index)
    app.use('/board', board)
    app.use('/topic', topic)
    app.use('/reply', reply)
    app.use('/user', user)
    app.use('/mail', mail)
    app.use('/search', searcher)
    app.use('/api/user', apiUser)
    app.use('/api/topic', apiTopic)

    // 添加 404 和 500 的处理页面
    app.use((request, response, next) => {
        response.status(404)
        response.render('404.html')
    })

    app.use((error, request, response, next) => {
        console.error(error.stack)
        response.status(500)
        response.render('500.html')
    })
}

const run = (port=3000, host='') => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        log(`listening server at http://${address.address}:${address.port}`)
    })
}

if (require.main === module) {
    configureApp()
    const port = 2000
    const host = '0.0.0.0'
    run(port, host)
}
