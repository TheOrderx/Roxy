exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const process = args[0];
    const Schema = require('../models/ServerRegister');
    const Data = await Schema.findOne({ serverID: message.guild.id }).exec();

            const channel = message.mentions.channels.first();
            if(!channel){
                message.channel.send({ embed: {
                    color: `${client.config.Color.Error}`,
                    description: `:waning: Lütfen bir kanal etiketleyin.`,
                    fields: [
                    {
                        name: `Örnek Komut:`,
                        value: `\`\`${prefix}kayıt ayar kayıt-kanalı-ayarla #Kanal\`\``
                    }
                    ]
                }}).catch(err => { client.Error(message,"kayıt:config",err); });
                return;
            }

            try{
                Data.LogChannel = channel.id
                Data.save((err,doc) => {
                    if(!err){
                        message.channel.send({ embed: {
                            color: `${client.config.Color.Success}`,
                            description: `:white_check_mark: Kayıt kanalı başarı ile **#${channel.name}** olarak ayarlandı.`
                        }}).catch(err => { client.Error(message,"kayıt:config",err); });
                        return;
                    }

                    if(err){
                        client.Error(message,"kayıt:config",err);
                        return;
                    }
                })
            }catch(err){
                message.channel.send({ embed: {
                    color: `${client.config.Color.Error}`,
                    description: `:warning: Lütfen bir kayıt kanalı ayarlayın.`
                }}).catch(err => { client.Error(message,"kayıt:rol-ayarla",err); });
                return;
            }
} 

exports.command = {
    name: "kayıt-log",
    aliases: ["register-log"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};