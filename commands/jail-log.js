exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require("../models/JailSystem");
    const Role = message.mentions.channels.first();

    if(!Role){
        message.channel.send({ embed: {
            color: `${client.config.Color.Info}`,
            description: `:warning: Lütfen bir kanal etiketleyerek tekrar deneyin.`
        }}).catch(err => { client.Error(message,"jailsystem:kanalayarla",err); });
        return;
    }

                const Data = Schema.findOne({ serverID: message.guild.id }).exec();
                try{
                    Data.ChannelID = Role.id
                    Data.save((err,doc) => {
                        if(err){
                            client.Error(message,"jailsystem:kanalayarla",err);
                            return;
                        }

                        if(doc){
                            message.react("✅");
                            return;
                        }
                    });
                }catch(Err){
                    const obj = { serverID: message.guild.id, ChannelID: Role.id }
                    const push = Schema(obj);
                    push.save((err,doc) => {
                        if(err){
                            client.Error(message,"jailsystem:kanalayarla",err);
                            return;
                        }

                        if(doc){
                            message.react("✅");
                            return;
                        }
                    });
                }    
}

exports.command = {
    name: "jail-log",
    aliases: ["jail-log-ayarla","jail-log-kanal-ayarla"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 30000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};