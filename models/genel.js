const mongoose = require('mongoose')


const şema = new mongoose.Schema({
guildid: String,
  
bankoruma: String,
bankorumalimit: String,
  
kanalkoruma: String,
kanalkorumalimit: String,
  
rolkoruma: String,
rolkorumalimit: String,
  
botkoruma: String,

güvenlikodası: String,
  
korumalog: String,
  
reklamengel: String,
})    

module.exports = new mongoose.model('Genel', şema)