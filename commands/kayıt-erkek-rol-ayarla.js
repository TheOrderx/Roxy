exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require('../models/ServerRegister');
    const role = message.mentions.roles.first();
    const Data = await Schema.findOne({ serverID: message.guild.id }).exec();

    if (!role) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:waning: Lütfen bir rol etiketleyin.`,
                fields: [
                    {
                        name: `Örnek Komut:`,
                        value: `\`\`${prefix}kayıt-erkek-rol-ayarla @Rol\`\``
                    }
                ]
            }
        }).catch(err => { client.Error(message, "kayıt:config", err); });
        return;
    }

    try {
        Data.BoyRoleID = role.id
        Data.save((err, doc) => {
            if (!err) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:white_check_mark: Erkek rolü başarı ile **${role.name}** olarak ayarlandı.`
                    }
                }).catch(err => { client.Error(message, "kayıt:config", err); });
                return;
            }

            if (err) {
                client.Error(message, "kayıt:config", err);
                return;
            }
        })
    } catch (err) {
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Lütfen bir kayıt kanalı ayarlayın.`
        }}).catch(err => { client.Error(message,"kayıt:rol-ayarla",err); });
        return;
    }
}

exports.command = {
    name: "kayıt-erkek-rol-ayarla",
    aliases: ["kayıt-erkek-rolü-ayarla"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};