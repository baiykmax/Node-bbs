const express = require('express')

const Reply = require('../models/reply')
const { log } = require('../utils')
const {
    currentUser,
    loginRequired,
} = require('../routes/main')
const { jsonResponse } = require('./main')

const router = express.Router()

router.post('/up/:id', async (request, response) => {
    const replyId = request.params.id
    const reply = await Reply.get(replyId)
    const u = await currentUser(request)
    if (u.username === '游客') {
        const dict = {
            success: false,
            message: '请先登录',
        }
        jsonResponse(request, response, dict)
    } else if (reply.user_id === u.id) {
        const dict = {
            success: false,
            message: '无法给自己点赞',
        }
        jsonResponse(request, response, dict)
    }  else {
        let action;
        reply.ups = reply.ups || [];
        let upIndex = reply.ups.indexOf(u.id);
        if (upIndex === -1) {
            reply.ups.push(u.id);
            action = 'up'
        } else {
            reply.ups.splice(upIndex, 1);
            action = 'down'
        }
        reply.save()
        const dict = {
            success: true,
            action: action,
        }
        jsonResponse(request, response, dict)
    }
})

module.exports = router