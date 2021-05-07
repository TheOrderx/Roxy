exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require("../models/JailSystem");
    const Role = message.mentions.roles.first();

    if(!Role){
        message.channel.send({ embed: {
            color: `${client.config.Color.Info}`,
            description: `:warning: Lütfen bir rol etiketleyerek tekrar deneyin.`
        }}).catch(err => { client.Error(message,"jailsystem:rolayarla",err); });
        return;
    }

                const Data = Schema.findOne({ serverID: message.guild.id }).exec();
                try{
                    Data.RoleID = Role.id
                    Data.save((err,doc) => {
                        if(err){
                            client.Error(message,"jailsystem:rolayarla",err);
                            return;
                        }

                        if(doc){
                            message.react("✅");
                            return;
                        }
                    });
                }catch(Err){
                    const obj = { serverID: message.guild.id, RoleID: Role.id }
                    const push = Schema(obj);
                    push.save((err,doc) => {
                        if(err){
                            client.Error(message,"jailsystem:rolayarla",err);
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
    name: "jail-rol-ayarla",
    aliases: ["jail-rolü-ayarla","jailrolayarla"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 30000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};