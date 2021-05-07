const mongoose = require('mongoose')


const şema = new mongoose.Schema({
userid: String,
guildid: String,
  
bankorumalimit: String,
rolkorumalimit: String,
kanalkorumalimit: String
})    

module.exports = new mongoose.model('Kullanıcı', şema)