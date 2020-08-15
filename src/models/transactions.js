const mongoose = require('mongoose')
const shortid = require('shortid')

const transactionSchema = new mongoose.Schema({
    _id: {
        'type': String,
        'default': shortid.generate
      },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction