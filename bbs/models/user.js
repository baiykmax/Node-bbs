const crypto = require('crypto')
const extend = require('mongoose-schema-extend')

const {
    mongoose,
    Model,
    BaseSchema,
} = require('./main')
const {log} = require('../utils')

const userSchema =  BaseSchema.extend({
    username: String,
    password: String,
    note: String,
    avatar: {
        type: String,
        default: 'default.gif',
    },
    role: {
        type: Number,
        default: 2,
    },
})

class UserStore extends Model {
    static async create(form) {
        form.password = this.saltedPassword(form.password)
        const u = await super.create(form)
        return u
    }

    static saltedPassword(password, salt='sjdf823jewqlk') {
        const salted = password + salt
        const hash = crypto.createHash('sha256')
        hash.update(salted)
        const h = hash.digest('hex')
        return h
    }

    static async validateLogin(form) {
        const {username, password} = form
        const u = await this.findBy('username', username)
        return u !== null && u.password === this.saltedPassword(password)
    }

    static async register(form) {
        const { username, password } = form
        const validForm = username.length > 2 && password.length > 2
        const uniqueUser = await this.findBy('username', username) === null
        if (validForm && uniqueUser) {
            const u = await this.create(form)
            return u
        } else {
            return null
        }
    }

    isAdmin() {
        return this.role === 1
    }

    static guest() {
        // 这样设置 _id 生成的实例就不会带有 _id 了
        const o = {
            _id: 0,
            role: -1,
            username: '游客',
        }
        const u = new User(o)
        return u
    }

    async topics() {
        const Topic = require('./topic')
        const userId = this.id
        const topics = await Topic.findAll('user_id', userId)
        return topics
    }

    async involvedTopicNumbers() {
        const Reply = require('./reply')
        const userId = this.id
        const replies = await Reply.findAll('user_id', userId)
        const topics = []
        replies.forEach(r => topics.push(r.topic_id))
        return topics.length
    }

    async involvedTopics() {
        const Topic = require('./topic')
        const Reply = require('./reply')
        const userId = this.id
        const replies = await Reply.findAll('user_id', userId)
        let topicList = []
        replies.forEach(r => topicList.push(r.topic_id))
        topicList = [...new Set(topicList)]
        topicList.sort((a, b) => b - a)
        const topics = []
        for(let i = 0; i < topicList.length; i++) {
            let topic = await Topic.get(topicList[i])
            topics.push(topic)
        }
        return topics
    }

    async latestTopics() {
        const Topic = require('./topic')
        const userId = this.id
        const topics = await Topic.findAll('user_id', userId)
        return topics.slice(topics.length - 1)[0]
    }
}

userSchema.loadClass(UserStore)
const User = mongoose.model('User', userSchema)

User.guest()

module.exports = User
