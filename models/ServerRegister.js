const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
    serverID: String,
    Status: Boolean,
    GirlRoleID: String,
    BoyRoleID: String,
    UnregisteredRoleID: String,
    JoinMessage: String,
    RegisterStaff: String,
    RegisterChannel: String,
    LogChannel: String
});

module.exports = mongoose.model('register', serverSchema)