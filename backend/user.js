const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

const UserModel = mongoose.model('users', UserSchema)
module.exports = UserModel