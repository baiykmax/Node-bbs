const express = require('express')

const Board = require('../models/board')
const Model = Board
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

main.get('/', adminRequired, async (request, response) => {
    const ms = await Model.all()
    const u = await currentUser(request)
    const token = randomString()
    csrfTokens[token] = u.id
    const args = {
        user: u,
        boards: ms,
        token: token,
    }
    response.render('board/index.html', args)
})

main.get('/new', async (request, response) => {
    const u = await currentUser(request)
    const token = randomString()
    csrfTokens[token] = u.id
    const args = {
        user: u,
        token: token,
    }
    response.render('board/new.html', args)
})

main.post('/add', async (request, response) => {
    const form = request.body
    const m = Model.create(form)
    response.redirect('/board')
})

main.get('/delete/:id', async (request, response) => {
    const id = request.params.id
    const u = await currentUser(request)
    const token = request.query.token
    if (token in csrfTokens && csrfTokens[token] === u.id) {
        delete csrfTokens[token]
        const t = await Model.remove(id)
        response.redirect('/board')
    } else {
        response.status(403).send('forbidden')
    }
})

main.get('/edit/:id', async (request, response) => {
    const id = request.params.id
    const m = await Model.get(id)
    const u = await currentUser(request)
    const args = {
        user: u,
        board: m,
    }
    response.render('board/edit.html', args)
})

main.post('/update', async (request, response) => {
    const form = request.body
    const m = await Model.update(form)
    response.redirect('/board')
})

module.exports = {
    board: main
}
