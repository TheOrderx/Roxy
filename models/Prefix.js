const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
    serverID: String,
    Prefix: String,
});

module.exports = mongoose.model('prefix', serverSchema)