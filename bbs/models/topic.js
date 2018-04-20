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
    up_users: {
        type: Array,
        default: [],
    },
})

class TopicStore extends Model {
    static async detail(id) {
        const m = await Topic.get(id)
        m.views += 1
        return m
    }

    static async allList(board_id) {
        let ms = []
        if (board_id === 'all' || board_id === '') {
            ms = await Topic.all()
        } else {
            ms =await Topic.findAll('board_id', board_id)
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
