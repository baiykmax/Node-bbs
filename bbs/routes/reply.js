const express = require('express')

const Reply = require('../models/reply')
const { log } = require('../utils')
const { currentUser, loginRequired } = require('./main')

const reply = express.Router()

//
reply.post('/add', loginRequired, async (request, response) => {
    const form = request.body
    const u = await currentUser(request)
    const kwargs = {
        user: u,
        user_id: u.id
    }
    const m = await Reply.create(form, kwargs)
    // 更新topic最后评论时间
    const Topic = require('../models/topic')
    const t = await Topic.updateLastReplyData(form.topic_id, u)
    response.redirect(`/topic/detail/${m.topic_id}`)
})

module.exports = reply
