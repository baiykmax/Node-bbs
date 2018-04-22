const extend = require('mongoose-schema-extend')

const {log} = require('../utils')
const {
    mongoose,
    Model,
    BaseSchema,
} = require('./main')

const StoreSchema =  BaseSchema.extend({
    board_id: String,
    topic_nums: {
        type: Number,
        default: 0,
    },
})

class StoreStore extends Model {
    static async detail(board_id) {
        const s = await Store.findBy("board_id", board_id)
        s.topic_nums += 1
        s.save()
        return s
    }

    static async allTopicNums() {
        let total = 0
        const stores = await Store.all()
        for ( let i of stores) {
            let n = i.topic_nums
            total += n
        }
        return total
    }
}

StoreSchema.loadClass(StoreStore)
const Store = mongoose.model('Store', StoreSchema)
module.exports = Store
