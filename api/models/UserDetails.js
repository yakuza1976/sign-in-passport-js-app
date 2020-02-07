const mongoose = require('mongoose')
const { Schema } = mongoose
const UserDetails = new Schema({
          username: String,
          password: String
        })

module.exports = mongoose.model('userInfo', UserDetails, 'userInfo')