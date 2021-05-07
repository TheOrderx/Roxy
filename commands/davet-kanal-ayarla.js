exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require('../models/ServerInvite');
    const channel = message.mentions.channels.first();

    if (!channel) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Lütfen geçerli bir kanal etiketleyin.`,
                fields: [
                    {
                        name: `Komut:`,
                        value: `\`\`${prefix}davet-kanal-ayarla #Kanal\`\``
                    }
                ]
            }
        }).catch(err => { client.Error(message, "davetsayaç:ayar", err); });
        return;
    }

    try {
        const Data = await Schema.findOne({ serverID: message.guild.id }).exec();
        Data.ChannelID = channel.id
        Data.save((err, doc) => {
            if (!err) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:white_check_mark: Davetiye sayaç kanalı başarı ile **#${channel.name}** olarak ayarlandı.`
                    }
                }).catch(err => { client.Error(message, "davetsayaç:ayar", err); });
                return;
            }

            if (err) {
                client.Error(message, "davetsayaç:ayar", err);
                return;
            }
        });
    } catch (err) {
        const obj = { 
            serverID: message.guild.id, 
            ChannelID: channel.id,
            LeaveMessage: `{user.name} kullanıcısı sunucudan ayrıldı, artık {member.size} kişiyiz.`,
            JoinMessage: `{user.name} sunucumuza katıldı; onu davet eden kişi: {davet.uye} - Toplam Üye: {member.size}`
        }
        const push = new Schema(obj);
        push.save((err, doc) => {
            if (!err) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:white_check_mark: Davetiye sayaç kanalı başarı ile **#${channel.name}** olarak ayarlandı.`
                    }
                }).catch(err => { client.Error(message, "davetsayaç:ayar", err); });
                return;
            }

            if (err) {
                client.Error(message, "davetsayaç:ayar", err);
                return;
            }
        });
    }
    return;
}

exports.command = {
    name: "davet-kanal-ayarla",
    aliases: ["davet-sayaç-kanal-ayarla"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};