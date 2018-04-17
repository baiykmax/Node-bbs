const formattedTime = (ts) => {
    const d = new Date(ts)
    return d.toLocaleString()
}

const formattedTimeAgo = (ts) => {
    let result
    const minute = 60000
    const hour = minute * 60
    const day = hour * 24
    const month = day * 30
    const now = Date.now()
    const differ = now - ts
    if (differ < 0) {
        alert("结束日期不能小于开始日期！")
    }
    if (differ >= month) {
        const month_ago = String(parseInt(differ / month))
        result = month_ago + "个月前"
    }
    else if (differ >= (7 * day)) {
        const week_ago = String(parseInt(differ / (7 * day)))
        result = week_ago + "周前"
    }
    else if (differ >= day) {
        const day_ago = String(parseInt(differ / day))
        result = day_ago + "天前"
    }
    else if (differ >= hour) {
        const hour_ago = String(parseInt(differ / hour))
        result = hour_ago + "个小时前"
    }
    else if (differ >= minute) {
        const min_ago = String(parseInt(differ / minute))
        result = min_ago + "分钟前"
    }
    else {
        result = "刚刚"
    }
    return result
}

module.exports = {
    formattedTime: formattedTime,
    formattedTimeAgo: formattedTimeAgo,
}
