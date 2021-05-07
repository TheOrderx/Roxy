const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
 serverID: String,
 ChannelID: String,
 HGContent: String,
 BBContent: String
})

module.exports = mongoose.model('hgbb', serverSchema)