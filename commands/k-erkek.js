const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require("../models/JailSystem");
    const Register = require('../models/ServerRegister');
    const User = message.mentions.users.first();

    if(!User){
        message.channel.send({ embed: {
            color: `${client.config.Color.Info}`,
            description: `:warning: Lütfen bir kullanıcı etiketleyerek tekrar deneyin.`
        }}).catch(err => { client.Error(message,"jail",err); });
        return;
    }

     const Data = await Schema.findOne({ serverID: message.guild.id }).exec();
     const RegisterData = await Register.findOne({ serverID: message.guild.id }).exec();

      try{
        if(message.member.roles.cache.has(Data.StaffRoleID) == false){
            message.channel.send({ embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Bu komut için yetkiniz yeterli değil!`
            }}).catch(err =>  { client.Error(message,"jail",err); });
            return;
        }
        message.guild.members.cache.get(User.id).roles.remove(Data.RoleID).then( Role => {
                message.guild.members.cache.get(User.id).roles.add(RegisterData.BoyRoleID).then( x => {
                    message.channel.send({ embed: {
                    color: `${client.config.Color.Success}`,
                    description: `:white_check_mark: Kullanıcının başarı ile cezası kaldırıldı!`
                }}).then( msg => {
                    
                }).catch(err => { client.Error(message,"jail",err); });
                return;
                })
            }).catch(err => { client.Error(message,"jail",err); });
        return;
    }catch(err){
        console.log(err);
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Sunucunuzda cezalı rolü veya yetkili rolü ayarlanmamış! Lütfen rolü ayarlayınız!\n**Komut:** \`\`${prefix}jail-rol-ayarla @Rol\`\``
        }}).catch(err => { client.Error(message,"jail",err); });
        return;
    }
}

exports.command = {
    name: "k-erkek",
    aliases: ["karantina-erkek"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 1000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};