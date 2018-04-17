const express = require('express')

const { log } = require('../utils')

const router = express.Router()

router.get('/', (request, response) => {
    let q = request.query.q
    q = encodeURIComponent(q)
    response.redirect('https://cn.bing.com/search?q=%' + q)
})

module.exports = router