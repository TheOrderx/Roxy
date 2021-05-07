exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require('../models/ServerRegister');
    const role = message.mentions.roles.first();
    if (!role) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:waning: Lütfen bir rol etiketleyin.`,
                fields: [
                    {
                        name: `Örnek Komut:`,
                        value: `\`\`${prefix}kayıtsız-rol-ayarla @Rol\`\``
                    }
                ]
            }
        }).catch(err => { client.Error(message, "kayıt:config", err); });
        return;
    }

    const Data = await Schema.findOne({ serverID: message.guild.id }).exec();

    try {
        Data.UnregisteredRoleID = role.id
        Data.save((err, doc) => {
            if (!err) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:white_check_mark: Kayıtsız rolü başarı ile **${role.name}** olarak ayarlandı.`
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
        client.Error(message, "kayıt:config", err);
        return;
    }
}

exports.command = {
    name: "kayıtsız-rolü-ayarla",
    aliases: ["kayıtsız-rol-ayarla"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};