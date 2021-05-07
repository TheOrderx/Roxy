const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
    serverID: String,
    RoleID: String
});

module.exports = mongoose.model('warn', serverSchema)