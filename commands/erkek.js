exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require('../models/ServerRegister');
    const TagSchema = require('../models/Tag');

    const Data = await Schema.findOne({ serverID: message.guild.id }).exec();
    const TagData = await TagSchema.findOne({ serverID: message.guild.id }).exec();
    try{
    
        if(message.channel.id != Data.RegisterChannel) return message.react("❌");
        if(message.member.roles.cache.has(Data.RegisterStaff) == false) return message.react("❌");

        const user = message.mentions.users.first();
        const name = args[1];
        const age = args[2];
         
         if(!user || !name || !age){
            message.channel.send({ embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Lütfen komutu doğru kullanınız.`,
                fields: [
                {
                    name: `Örnek:`,
                    value: `\`\`${prefix}erkek @User İsim Yaş\`\``
                }
                ]
            }}).catch(err => { client.Error(message,"kayıt:erkek",err); });
            return;
         }

         const member = message.guild.members.cache.get(user.id);

         try{
            member.setNickname(`${TagData.Tag} ${name} | ${age}`).catch(err => { client.Error(message,"kayıt:erkek",err); });
         }catch(err){
            member.setNickname(`${name} | ${age}`).catch(err => { client.Error(message,"kayıt:erkek",err); });
         }
         member.roles.remove(Data.UnregisteredRoleID).catch(err => { client.Error(message,"kayıt:erkek",err); });
         member.roles.add(Data.BoyRoleID).catch(err => { client.Error(message,"kayıt:erkek",err); });

         message.channel.send({ embed: {
            color: `${client.config.Color.Success}`,
            description: `:white_check_mark: Kayıt başarılı!`
         }}).catch(err => { client.Error(message,"kayıt:erkek",err); });

         message.guild.channels.cache.get(Data.LogChannel).send(`🟢 **${member.user.tag}** (\`\`${member.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) adlı yetkili tarafından **erkek** olarak kayıt edildi.`).catch(err => { client.Error(message,"kayıt:erkek",err); });
         return;

    }catch(err){
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Lütfen gerekli ayarlamaları yapınız.`,
            fields: [
            {
                name: `Komut:`,
                value: `\`\`${prefix}kayıt kur\`\``
            }
            ]
        }}).catch(err => { client.Error(message,"kayıt:erkek",err); });
        return;
    }
} 

exports.command = {
    name: "erkek",
    aliases: ["kayıt-erkek"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};