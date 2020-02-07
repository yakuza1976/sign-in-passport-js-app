const mongoose = require('mongoose')
const server = process.env.MONGO_URL || 'localhost'
const database = process.env.MONGO_DB || 'AuthDataBase'

mongoose.connect(`mongodb://${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })

mongoose.connection.on('error', function () {
        console.log('Database connection error')
})

module.exports = mongoose