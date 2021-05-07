exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const db = require('../models/genel')

    let komut = args[0]
    db.findOne({ guildid: message.guild.id }, (error, data) => {
        if (komut === 'aç') {
            if (!data) {
                let data = new db({
                    guildid: message.guild.id,
                    bankoruma: 'true'
                }).save()
                message.reply('Ban koruma sistemi açıldı!')
                return
            } else {
                data.bankoruma = 'true'
                data.save()
                message.reply('Ban koruma sistemi açıldı!')
                return
            }
        } else if (komut === 'kapat') {
            if (!data || data === null) return message.reply('Ban koruma zaten kapalı!')
            if (!data || !data.bankoruma || data.bankoruma === null || data.bankoruma === 'false') return message.reply('Ban koruma zaten kapalı!')
            data.bankoruma = 'false'
            data.save()
            message.reply('Ban koruma sistemi kapatıldı!')
        } else {
            message.reply('Lütfen sadece **aç** veya **kapat** yazınız!')
        }
    })
}

exports.command = {
    name: "bankoruma",
    aliases: ["ban-koruma"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};