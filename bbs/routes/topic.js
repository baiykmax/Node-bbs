const express = require('express')
const _ = require('lodash');

const Topic = require('../models/topic')
const Board = require('../models/board')
const Store = require('../models/store')
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
        }
        topics.push(topic)
    }
    return topics
}

const topicPagination = async function (currentPage, board_id) {
    const limit = 10
    const offset = currentPage - 1 > 0 ? currentPage - 1 : 0
    const ms = await Topic.allList(board_id, offset, limit)
    const ds = ['owner', 'lastReplyUser', 'board', 'replies']
    const topics = await topicDataList(ms, ds)
    const allTopicNums = await Store.allTopicNums()
    const curBoardTopic = await Store.findBy('board_id', board_id)
    const allBoardTopicNmus = curBoardTopic ? curBoardTopic.topic_nums : 0
    const len = (board_id === "all" || board_id === "") ? allTopicNums : allBoardTopicNmus
    const pages= Math.ceil(len / limit)
    const page_start = currentPage - 2 > 1 ? currentPage - 2 : 1
    const page_end = page_start + 4 >= pages ? pages : page_start + 4
    const frontPage = parseInt(currentPage) - 1
    const nextPage = parseInt(currentPage) + 1
    const range = _.range(page_start, page_end + 1)
    const paginationData = {
        topics: topics,
        pages: pages,
        range: range,
        page_start: page_start,
        page_end: page_end,
        frontPage: frontPage,
        nextPage: nextPage,
    }
    return paginationData
}

const topic = express.Router()

topic.get('/', async (request, response) => {
    const u = await currentUser(request)
    const board_id = request.query.board_id || ""
    const currentPage = request.query.page || "1"
    let {
        topics,
        pages,
        range,
        page_start,
        page_end,
        frontPage,
        nextPage
    } = await topicPagination(parseInt(currentPage), board_id)
    const boards = await Board.all()
    const args = {
        current_user: u,
        user: u,
        topics: topics,
        boards: boards,
        board_id: board_id,
        current_page: currentPage,
        pages: pages,
        range: range,
        page_start: page_start,
        page_end: page_end,
        frontPage: frontPage,
        nextPage: nextPage,
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
    const s = await Store.detail(m.board_id)
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
