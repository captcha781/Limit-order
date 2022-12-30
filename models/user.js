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
}, {
    timestamps: true
})

module.exports = mongoose.model('users', Schema, 'users')