const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
    serverID: String,
    ChannelID: String,
    JoinMessage: String,
    LeaveMessage: String
});

module.exports = mongoose.model('invite', serverSchema)