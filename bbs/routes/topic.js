const express = require('express')

const Topic = require('../models/topic')
const Board = require('../models/board')
const { log } = require('../utils')
const {
    currentUser,
    loginRequired,
    htmlResponse,
} = require('./main')

const topicDataList = async function (arr, keyList) {
    const topics = []
    for(let i = 0; i < arr.length; i++) {
        let topic = arr[i]
        for(let j = 0; j < keyList.length; j++) {
            let method = keyList[j]
            let data = await topic[method]()
            topic[keyList[j].toString()] = data
            topics.push(topic)
        }
        topics.push(topic)
    }
    return topics
}

const topic = express.Router()

topic.get('/', async (request, response) => {
    const u = await currentUser(request)
    const board_id = request.query.board_id || ""
    const ms = await Topic.allList(board_id)
    const ds = ['owner', 'lastReplyUser', 'board', 'replies']
    const topics = await topicDataList(ms, ds)
    // const topics = []
    // for(let i = 0; i < ms.length; i++) {
    //     let topic = ms[i]
    //     let owner = await topic.owner()
    //     topic['owner'] = owner
    //     let lastReplyUser = await topic.lastReplyUser()
    //     topic['lastReplyUser'] = lastReplyUser
    //     let board = await topic.board()
    //     topic['board'] = board
    //     let replies = await topic.replies()
    //     topic['replies'] = replies
    //     topics.push(topic)
    // }
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
    const owner = await m.owner()
    m['owner'] = owner
    const board = await m.board()
    m['board'] = board
    const replies = await m.replies()
    const topicReplies = []
    for(let i = 0; i < replies.length; i++) {
        let reply = replies[i]
        let user = await reply.user()
        reply['user'] = user
        topicReplies.push(reply)
    }
    const args = {
        current_user: u,
        user: u,
        topic: m,
        topicReplies: topicReplies,
    }
    htmlResponse(response, 'topic/detail.html', args)
})

topic.get('/new', loginRequired, async (request, response) => {
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
    const u = await currentUser(request)
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
