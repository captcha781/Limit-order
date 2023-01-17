const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    privateKey: {
        type: Object,
        default: {}
    },
    walletId: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('users', Schema, 'users')