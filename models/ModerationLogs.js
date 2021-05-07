const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
 serverID: String,
 Staff: String,
 StaffID: String,
 ChannelID: String
})

module.exports = mongoose.model('modlog', serverSchema)