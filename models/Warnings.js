const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
    ID: Number,
    serverID: String,
    userID: String,
    moderatorID: String,
    Reason: String,
    Date: String,
    Active: Boolean
});

module.exports = mongoose.model('warnings', serverSchema)