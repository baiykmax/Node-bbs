const express = require('express')
// multer 是用来处理上传文件的模块
const multer = require('multer')
const { uploadPath } = require('../config')

// 配置 multer 模块
// dest 表示文件上传之后保存的路径
const upload = multer({
    dest: uploadPath,
})

const topicDataList = async function (arr, limit=arr.length) {
    const topics = []
    for(let i = 0; i < arr.length; i++) {
        let topic = arr[i]
        let replies = await topic.replies()
        topic['replies'] = replies
        topics.push(topic)
    }
    return topics.slice(0, limit)
}

const User = require('../models/user')
const { log } = require('../utils')
const {
    currentUser,
    loginRequired,
    htmlResponse
} = require('./main')

const main = express.Router()

main.get('/:username', async (request, response) => {
    const username = request.params.username
    const u = await User.findBy('username', username)
    if (u === null) {
        return response.redirect('/topic')
    }
    const involvedTopicNumbers = await u.involvedTopicNumbers()
    const involvedTopics = await u.involvedTopics()
    const involveTopics = await topicDataList(involvedTopics, 5)
    //
    const userTopics = await u.topics()
    const topics = await topicDataList(userTopics, 5)
    const args = {
        u: u,
        user: u,
        involvedTopicNumbers: involvedTopicNumbers,
        involvedTopics: involveTopics,
        userTopics: topics,
    }
    htmlResponse(response, 'user/user_view.html', args)
})

main.get('/:username/topics', async (request, response) => {
    const username = request.params.username
    const u = await User.findBy('username', username)
    if (u === null) {
        return response.redirect('/topic')
    }
    const involvedTopicNumbers = await u.involvedTopicNumbers()
    const userTopics = await u.topics()
    const topics = await topicDataList(userTopics)
    const args = {
        u: u,
        user: u,
        involvedTopicNumbers: involvedTopicNumbers,
        userTopics: topics,
    }
    htmlResponse(response, 'user/user_all_topics.html', args)
})

main.get('/:username/replies', async (request, response) => {
    const username = request.params.username
    const u = await User.findBy('username', username)
    if (u === null) {
        return response.redirect('/topic')
    }
    const involvedTopicNumbers = await u.involvedTopicNumbers()
    const involvedTopics = await u.involvedTopics()
    const involveTopics = await topicDataList(involvedTopics)
    const args = {
        u: u,
        user: u,
        involvedTopicNumbers: involvedTopicNumbers,
        involvedTopics: involveTopics,
    }
    htmlResponse(response, 'user/user_all_replies.html', args)
})

// 用户的个人资料页面的路由
main.get('/profile/:id', loginRequired, async (request, response) => {
    const user = await currentUser(request)
    const id = request.params.id
    const u = await User.get(id)
    const involvedTopicNumbers = await u.involvedTopicNumbers()
    const involvedTopics = await u.involvedTopics()
    const args = {
        u: u,
        user: user,
        involvedTopicNumbers: involvedTopicNumbers,
        involvedTopics: involvedTopics,
    }
    htmlResponse(response, 'user/user_view.html', args)
})

// 用户上传头像的路由, 这里会依次调用三个处理函数
main.post('/upload/avatar', loginRequired, upload.single('avatar'), async (request, response) => {
    // upload.single 获取上传的文件并且处理
    // request.file 是处理之后的信息
    const u = await currentUser(request)
    const avatar = request.file
    // filename 是保存在 dest 中的文件名, 这里我们不使用用户上传的文件名, 直接用 multer 处理之后的名字
    // 因为用户上传的文件名从安全角度来看是有风险的
    u.avatar = avatar.filename
    response.redirect(`/user/profile/${u.id}`)
})

// 获取头像的路由
main.get('/avatar/:filename', (request, response) => {
    const path = require('path')
    // 头像所在的路径, 我们配置的时候使用的时候相对路径
    const filename = request.params.filename
    const p = uploadPath + filename
    // response.sendFile 的参数是一个绝对路径
    // 使用 path.resolve 把头像的路径转换成绝对路径
    const absolutePath = path.resolve(p)
    // 实际上图片也是发一个请求, 我们最初的课程是按照 /static?file 的形式来处理的
    // 常见的验证码是一张图片, 处理方式也是这种
    // /captcha?random=45678
    // 点击图片的时候会换一张验证码, 实际上就是拿到前端传过来的随机数,
    // 然后生成一个新的随机数, 最后写入到图片中
    response.sendFile(absolutePath)
})

main.get('/setting/:id', async (request, response) => {
    const id = request.params.id
    const m = await User.get(id)
    const u = await currentUser(request)
    if (m.id === u.id) {
        const args = {
            user: u,
        }
        htmlResponse(response, 'user/setting.html', args)
    } else {
        response.status(403).send('forbidden')
    }
})

main.post('/update', async (request, response) => {
    const form = request.body
    const u = await currentUser(request)
    const m = await User.update(form)
    request.session.flash = {
        message: '修改成功',
    }
    response.redirect(`/user/setting/${u.id}`)
})

module.exports = {
    user: main,
}
