const extend = require('mongoose-schema-extend')

const {log} = require('../utils')
const {
    mongoose,
    Model,
    BaseSchema,
} = require('./main')

const MailSchema =  BaseSchema.extend({
    title: String,
    content: String,
    read: Boolean,
    receiver_id: String,
    sender_id: String,
})

class MailStore extends Model {
    set_sender(id) {
        this.sender_id = id
        this.save()
    }

    set_receiver(id) {
        this.receiver_id = id
        this.save()
    }

    mark_read() {
        this.read = true
        this.save()
    }
}

MailSchema.loadClass(MailStore)
const Mail = mongoose.model('Mail', MailSchema)
module.exports = Mail
