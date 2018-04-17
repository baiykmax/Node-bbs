const User = require('../models/user')

const { log } = require('../utils')

const currentUser = async (request) => {
    // 通过 session 获取 uid, 如果没有的话就设置成空字符串
    const uid = request.session.uid
    if (uid === undefined) {
        return User.guest()
    } else {
        const u = await User.get(uid)
        if (u === null) {
            return User.guest()
        } else {
            return u
        }
    }
}

const loginRequired = async (request, response, next) => {
    const u = await currentUser(request)
    if (u.role === -1) {
        log('登录检测: 没有登录', request.method)
        const baseUrl = '/login'
        if (request.method === 'POST') {
            response.redirect(baseUrl)
        } else {
            const nextUrl = baseUrl + '?next_url=' + request.originalUrl
            response.redirect(nextUrl)
        }
    } else {
        next()
    }
}

const adminRequired = async (request, response, next) => {
    const u = await currentUser(request)
    if (u.isAdmin()) {
        next()
    } else {
        response.redirect('/login')
    }
}

const htmlResponse = (response, path, data) => {
    response.render(path, data)
}

module.exports = {
    currentUser: currentUser,
    htmlResponse: htmlResponse,
    loginRequired: loginRequired,
    adminRequired: adminRequired,
}
