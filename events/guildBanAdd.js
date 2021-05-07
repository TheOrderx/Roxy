module.exports = async (client,guild,member) => {
    const modlogSchema = require("../models/ModerationLogs");
    const serverGuard = require('../models/ServerGuard');

    const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_ADD', });
    const banLog = fetchedLogs.entries.first();
    const { executor, target } = banLog;

    try{
        const Data = await modlogSchema.findOne({ serverID: guild.id }).exec();
        guild.channels.cache.get(Data.ChannelID).send({ embed: {
            color: `RED`,
            description: `:x: ${member.user.tag} adlı kullanıcı ${executor.tag} tarafından banlandı.`
        }});
    }catch(err){ return; }

    try{
        const Data = await serverGuard.findOne({ serverID: guild.id }).exec();
        if(Data.BanHammer.Status == true){
            
        }
    }catch(err){ return; }
}