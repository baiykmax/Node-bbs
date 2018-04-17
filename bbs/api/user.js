const express = require('express')
// multer 是用来处理上传文件的模块
const multer = require('multer')
const fs = require('fs')
// 文件上传之后保存的路径, 这个路径希望做成可以配置的, 所以就写入到 config 中
const { uploadPath } = require('../config')
// 配置 multer 模块
// dest 表示文件上传之后保存的路径
const upload = multer({
    dest: uploadPath,
})
const type = upload.single('file')

const {
    currentUser,
    loginRequired,
} = require('../routes/main')
const { log } = require('../utils')
const { jsonResponse } = require('./main')

const router = express.Router()

router.post('/upload/avatar', loginRequired, type, async (request, response) => {
    // upload.single 获取上传的文件并且处理
    // request.file 是处理之后的信息
    const u = await currentUser(request)
    const avatar = request.file
    // filename 是保存在 dest 中的文件名, 这里我们不使用用户上传的文件名, 直接用 multer 处理之后的名字
    // 因为用户上传的文件名从安全角度来看是有风险的
    u.avatar = avatar.filename
    u.save()
    const dict = {
        success: true,
        data: u.avatar,
        message: '',
    }
    jsonResponse(request, response, dict)
})

module.exports = router
