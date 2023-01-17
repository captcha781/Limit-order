const mongoose = require('mongoose')

const adminstratorSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    BNB: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    USDT: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('administrator', adminstratorSchema, 'administrator')