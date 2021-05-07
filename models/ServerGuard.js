const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
 serverID: String,
 BanHammer: {
 	Status: Boolean,
 	Size: Number
 },
 Bot: Boolean
})

module.exports = mongoose.model('guard', serverSchema)