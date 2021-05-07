const mongoose = require("mongoose");
const { MessageAttachment } = require("discord.js");

module.exports = async (client) => {
    const AfkSchema = require('../models/Afk');
    const AdsSchema = require('../models/ServerAds');
    const SupportSchema = require('../models/ServerSupport');
    const wait = require('util').promisify(setTimeout);
    await client.user.setStatus("dnd");
    await client.user.setActivity("!davet !yardım v1");
    await wait(1000);

    client.guilds.cache.forEach(g => {
      g.fetchInvites().then(guildInvites => {
        client.invites[g.id] = guildInvites;
      }).catch(err => {return;})
    });
    console.log("[Bot] Now online!");

    mongoose.connect(`mongodb://${client.config.Data.IP}:${client.config.Data.Port}/${client.user.tag}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err) {
        if (!err) return console.log("[MongoDB] Connection successful.");
        if (err) {
            console.log(`[MongoDB] Database connection failed.`);
            process.exit();
            return;
        }
    });

    client.channels.cache.forEach( async channel => {
     const SupportData = await SupportSchema.findOne({ serverID: channel.guild.id }).exec();
      if(channel.name.split("-")[0] == "ticket" && channel.parentID == SupportData.Config.ParentID){
       client.Tickets.set(`${channel.guild.id}_${channel.name.split("-")[1]}`, channel.id);
      }
    });

    AfkSchema.find({}).then(data => { data.forEach(Data => { client.Afk.set(Data.userID, Data.Reason); }); });
    SupportSchema.find({}).then( data => { data.forEach( Data => { client.SupportChannels.set(Data.serverID,Data.Config.SupportChannel); }); });

        setInterval(function () {
            AdsSchema.find({}).then(data => {
                data.forEach(async Data => {
                    if (Data.Timeout == 0 || (Data.Timeout < 0) == true) {
                        await AdsSchema.findOneAndDelete({ _id: Data._id });
                    } else {
                        const Datax = await AdsSchema.findOne({ _id: Data._id }).exec();
                        Datax.Timeout = Datax.Timeout - 5000;
                        Datax.save();
                    }
            });
            });

            SupportSchema.find({}).then( data => {
                data.forEach( Data => {
                    client.SupportChannels.set(Data.serverID,Data.Config.SupportChannel);
                });
            });
    }, 5000)
    setInterval(function () { client.guilds.cache.forEach(server => { client.serverPanel(server.id); }); }, client.config.Timeouts.ServerPanelUpdate * 1000);
}