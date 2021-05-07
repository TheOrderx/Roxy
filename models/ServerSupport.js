const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
 serverID: String,
 Key: String,
 MessageID: String,
 Stats: {
     TotalTicket: Number,
     SuccessTicket: Number,
     FailedTicket: Number,
     TotalMessage: Number
 },
 Config: {
     ParentID: String,
     SupportChannel: String,
     SupportRoleID: String,
     TicketMessageContent: String,
     LogChannel: String
 },
 Bans: String
})

module.exports = mongoose.model('support', serverSchema)