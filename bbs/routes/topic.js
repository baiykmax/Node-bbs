const express = require('express')

const Topic = require('../models/topic')
const Board = require('../models/board')
const { log } = require('../utils')
const {
    currentUser,
    loginRequired,
    htmlResponse,
} = require('./main')

const topic = express.Router()

topic.get('/', async (request, response) => {
    const u = await currentUser(request)
    const board_id = request.query.board_id || ""
    const ms = await Topic.allList(board_id)
    const boards = await Board.all()
    const args = {
        current_user: u,
        user: u,
        topics: ms,
        boards: boards,
        board_id: board_id,
    }
    htmlResponse(response, 'topic/index.html', args)
})

topic.get('/detail/:id', async (request, response) => {
    const u = await currentUser(request)
    const id = request.params.id
    const m = await Topic.detail(id)
    const args = {
        current_user: u,
        user: u,
        topic: m,
    }
    htmlResponse(response, 'topic/detail.html', args)
})

topic.get('/new', async (request, response) => {
    const boards = await Board.all()
    const u = await currentUser(request)
    const args = {
        user: u,
        boards: boards,
    }
    htmlResponse(response, 'topic/new.html', args)
})

topic.post('/add', loginRequired, async (request, response) => {
    const form = request.body
    const m = await Topic.create(form, {
        user_id: u.id,
    })
    response.redirect('/topic')
})

// topic.get('/delete/:id', async (request, response) => {
//     const id = request.params.id
//     const t = await Topic.remove(id)
//     response.redirect('/topic')
// })
//
// topic.get('/edit/:id', async (request, response) => {
//     const id = request.params.id
//     const m = await Topic.get(id)
//     const u = await currentUser(request)
//     const args = {
//         user: u,
//         topic: m,
//     }
//     htmlResponse(response, 'topic/edit.html', args)
// })
//
// topic.post('/update', async (request, response) => {
//     const form = request.body
//     const m = await Topic.update(form)
//     response.redirect('/topic')
// })

module.exports = topic
