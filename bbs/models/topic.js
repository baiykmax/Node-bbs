const extend = require('mongoose-schema-extend')

const {log} = require('../utils')
const {
    mongoose,
    Model,
    BaseSchema,
} = require('./main')

const TopicSchema =  BaseSchema.extend({
    title: String,
    content: String,
    user_id:  String,
    board_id:  String,
    last_reply_user_id:  String,
    views: {
        type: Number,
        default: 0,
    },
    last_reply_time: {
        type: Number,
        default: Date.now(),
    },
})

class TopicStore extends Model {
    static async detail(id) {
        const m = await Topic.get(id)
        m.views += 1
        m.save()
        return m
    }

    static async allList(board_id, offset, limit) {
        let ms = []
        if (board_id === 'all' || board_id === '') {
            ms = await Topic.allSkip(offset, limit)
        } else {
            // ms = await Topic.findAll('board_id', board_id)
            ms = await Topic.findSkip('board_id', board_id, offset, limit)
        }
        return ms
    }

    static async updateLastReplyData(id, u) {
        const now = Date.now()
        const t = await Topic.get(id)
        t.last_reply_time = now
        t.last_reply_user_id = u.id
        t.save()
        return t
    }

    static async noReplyTopic() {
        const ms = await Topic.findAll('last_reply_user_id', null)
        const random = Math.random() * ms.length
        const index = Math.floor(random)
        const m = ms[index]
        return m
    }

    async user() {
        const User = require('./user')
        const u = await User.get(this.user_id)
        return u
    }

    async replies() {
        const Reply = require('./reply')
        const ms = await Reply.findAll('topic_id', this.id)
        return ms
    }

    async board() {
        const Board = require('./board')
        const b = await Board.get(this.board_id)
        return b
    }

    async owner() {
        const User = require('./user')
        const u = await User.get(this.user_id)
        return u
    }

    async lastReplyUser() {
        const User = require('./user')
        const u = await User.get(this.last_reply_user_id)
        return u
    }
}

TopicSchema.loadClass(TopicStore)
const Topic = mongoose.model('Topic', TopicSchema)
module.exports = Topic
