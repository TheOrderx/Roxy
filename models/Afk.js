const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
    userID: String,
    Reason: String,
});

module.exports = mongoose.model('afk', serverSchema)