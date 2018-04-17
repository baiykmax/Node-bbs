const express = require('express')

const Topic = require('../models/topic')
const Model = Topic
const { log } = require('../utils')
const { jsonResponse } = require('./main')

const router = express.Router()

router.get('/all', (request, response) => {
    const ms = Model.all()
    log('request headers', request.headers)
    const dict = {
        success: true,
        data: ms,
        message: '',
    }
    jsonResponse(request, response, dict)
})

router.get('/detail/:id', (request, response) => {
    const id = Number(request.params.id)
    const m = Model.detail(id)
    const dict = {
        success: true,
        data: m,
        message: '',
    }
    jsonResponse(request, response, dict)
})

router.post('/add', (request, response) => {
    const form = request.body
    console.log('debug body', form)
    const m = Model.create(form)
    const dict = {
        success: true,
        data: m,
        message: '',
    }
    jsonResponse(request, response, dict)
})

module.exports = router
