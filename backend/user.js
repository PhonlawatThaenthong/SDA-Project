const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email : {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

const UserModel = mongoose.model('users', UserSchema)
module.exports = UserModel