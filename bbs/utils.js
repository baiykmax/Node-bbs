const fs = require('fs')

const formatTime = () => {
    const d = new Date()

    const hour = d.getHours()
    const minute = d.getMinutes()
    const second = d.getSeconds()

    const t = `${hour}:${minute}:${second}`
    return t
}

const log = (...args) => {
    const path = './gua.log.txt'

    const output = fs.createWriteStream(path, {
        // a 表示把内容添加到文件中(以追加的形式, 而不是覆盖)
        flags: 'a'
    })
    const t = formatTime()
    // 普通 log 函数
    console.log.call(console, t, ...args)
    // 把 log 的结果写入到文件中
    const logger = new console.Console(output)
    // process.stdout
    logger.log(t, ...args)
}

module.exports = {
    log: log,
}
