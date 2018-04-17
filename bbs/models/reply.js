const extend = require('mongoose-schema-extend')

const {log} = require('../utils')
const {
    mongoose,
    Model,
    BaseSchema,
} = require('./main')

const ReplySchema =  BaseSchema.extend({
    content: String,
    topic_id: String,
    user_id: String,
})

class ReplyStore extends Model {
    async user() {
        const User = require('./user')
        const u = await User.get(this.user_id)
        return u
    }
}

ReplySchema.loadClass(ReplyStore)
const Reply = mongoose.model('Reply', ReplySchema)
module.exports = Reply
