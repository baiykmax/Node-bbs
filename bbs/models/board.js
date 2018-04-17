const extend = require('mongoose-schema-extend')

const {log} = require('../utils')
const {
    mongoose,
    Model,
    BaseSchema,
} = require('./main')

const BoardSchema =  BaseSchema.extend({
    title: String,
})

class BoardStore extends Model {
    static async update(form={}) {
        const id = form.id
        const m = await this.get(id)
        const keys = this.frozenKeys()
        Object.keys(form).forEach((k) => {
            if (!keys.includes(k)) {
                m[k] = form[k]
            }
        })
        m.updated_time = Date.now()
        m.save()
        return m
    }

    static frozenKeys() {
        const l = [
            'id',
            'created_time',
        ]
        return l
    }
}

BoardSchema.loadClass(BoardStore)
const Board = mongoose.model('Board', BoardSchema)
module.exports = Board
