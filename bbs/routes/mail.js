const express = require('express')

const Mail = require('../models/mail')
const Model = Mail
const { log } = require('../utils')
const {
    currentUser,
    loginRequired,
    adminRequired
} = require('./main')

// 使用 express.Router 可以创建模块化的路由
// 类似我们以前实现的形式
const main = express.Router()

const randomString = () => {
    const seed = 'asdfghjokpwefdsui3456789dfghjk67wsdcfvgbnmkcvb2e'
    let s = ''
    for (let i = 0; i < 16; i++) {
        const random = Math.random() * seed.length
        const index = Math.floor(random)
        s += seed[index]
    }
    return s
}

const csrfTokens = {}

main.get('/', loginRequired, async (request, response) => {
    const u = await currentUser(request)
    const sendMail = await Model.findAll('sender_id', u.id)
    const receivedMail = await Model.findAll('receiver_id', u.id)
    const token = randomString()
    csrfTokens[token] = u.id
    const args = {
        user: u,
        sendMail: sendMail,
        receivedMail: receivedMail,
        token: token,
    }
    response.render('mail/index.html', args)
})

main.post('/add', loginRequired, async (request, response) => {
    const u = await currentUser(request)
    const form = request.body
    const mail = await Model.create(form)
    mail.set_sender(u.id)
    mail.set_receiver(form.to)
    response.redirect('/mail')
})

main.get('/view/:id', loginRequired, async (request, response) => {
    const id = request.params.id
    const u = await currentUser(request)
    const mail = await Model.get(id)
    const token = request.query.token
    if (token in csrfTokens && csrfTokens[token] === u.id) {
        delete csrfTokens[token]
        if (u.id === mail.receiver_id) {
            mail.mark_read()
        }
        if ([mail.receiver_id, mail.sender_id].includes(u.id)) {
            const args = {
                user: u,
                mail: mail,
            }
            response.render('mail/detail.html', args)
        } else {
            response.redirect('/mail')
        }
    } else {
        response.status(403).send('forbidden')
    }
})

module.exports = {
    mail: main
}
