module.exports = async (client,member) => {
    const HgBbSchema = require('../models/HgBb');

    try{
        const HgBbData = await HgBbSchema.findOne({ serverID: member.guild.id }).exec();
        const String = HgBbData.BBContent.replace("{user.name}", member.user.tag);
        member.guild.channels.cache.get(HgBbData.ChannelID).send(String);
    }catch(err){  }
}