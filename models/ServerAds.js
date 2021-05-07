const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
    serverID: String,
    ModeratorID: String,
    ModeratorName: String,
    Timeout: Number,
    NextDate: String,
    NextTime: String
});

module.exports = mongoose.model('ads', serverSchema)