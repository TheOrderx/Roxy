const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
    serverID: String,
    Tag: String,
    RoleID: String
});

module.exports = mongoose.model('tag', serverSchema)