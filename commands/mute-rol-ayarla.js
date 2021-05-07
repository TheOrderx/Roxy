exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require('../models/Mute');
    const Role = message.mentions.roles.first();

    if(!Role){
        message.channel.send({ embed: {
            color: `${client.config.Color.Info}`,
            description: `:warning: Lütfen bir rol etiketleyerek tekrar deneyin.`
        }}).catch(err => { client.Error(message,"warn:rol-ayarla",err); });
        return;
    }

    const Data = await Schema.findOne({ serverID: message.guild.id }).exec();

    try{
        Data.RoleID = Role.id
        Data.save((err,doc) => {
            if(err){
                client.Error(message,"mute:rol-ayarla",err);
                return;
            }

            if(doc){
                message.channel.send({ embed: {
                    color: `${client.config.Color.Success}`,
                    description: `:white_check_mark: Rol başarı ile güncellendi. Susturulacak kullanıcılara **${Role.name}** rolü verilecek.`
                }}).catch(err => { client.Error(message,"uyarı:rol-ayarla",err); });
                return;
            }
        });
    }catch(err){
        const obj = { serverID: message.guild.id, RoleID: Role.id }
        const push = new Schema(obj);
        push.save((err,doc) => {
            if(err){
                client.Error(message,"mute:rol-ayarla",err);
                return;
            }

            if(doc){
                message.channel.send({ embed: {
                    color: `${client.config.Color.Success}`,
                    description: `:white_check_mark: Rol başarı ile ayarlandı. Susuturulacak kullanıcılara **${Role.name}** rolü verilecek.`
                }}).catch(err => { client.Error(message,"mute:rol-ayarla",err); });
                return;
            }

        });
    }
}

exports.command = {
    name: "mute-rol-ayarla",
    aliases: ["mute-rolü-ayarla"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};