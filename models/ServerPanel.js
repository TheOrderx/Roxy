const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serverSchema = new Schema({
    serverID: String,
    rekorOnline: Number,
    ChannelData: {
        TotalUye: String,
        OnlineUye: String,
        Bot: String,
        RekorOnline: String,
        Voice: String
    },
    ChannelContent: {
        TotalUye: String,
        OnlineUye: String,
        Bot: String,
        RekorOnline: String,
        Voice: String
    }
});

module.exports = mongoose.model('serverpanel', serverSchema)