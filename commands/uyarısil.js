exports.run = async (client, message, args) => {
    const ID = args[0];
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require('../models/Warnings');

    if(!ID || isNaN(ID) == true){
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Lütfen geçerli bir uyarı ID numarası yazın.`
        }}).catch(err => { client.Error(message,"warn:delete",err); });
        return;
    }

    const Data = await Schema.findOne({ serverID: message.guild.id, ID: args[0]}).exec();

    try{
        Data.Active = false;
        Data.save((err,doc) => {
            if(err){
                client.Error(message,"warn:delete",err);
                return;
            }

            if(doc){
                message.channel.send({ embed: {
                    color: `${client.config.Color.Info}`,
                    description: `:white_check_mark: \`\`#${Data.ID}\`\` ID numaralı uyarı kaydı silindi.`
                }}).catch(err => { client.Error(message,"warn:delete",err); });
                return;
            }
        });
        return;
    }catch(Err){
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Uyarı kaydı bulunamadı!`
        }}).catch(Err => { client.Error(message,"warn:Delete",Err); });
        return;
    }
}

exports.command = {
    name: "uyarı-sil",
    aliases: ["uyarı-kaldır","uyarısil"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};