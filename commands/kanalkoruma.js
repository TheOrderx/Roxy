exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const db = require('../models/genel')

    let komut = args[0]
    db.findOne({ guildid: message.guild.id }, (error, data) => {
        if (komut === 'aç') {
            if (!data) {
                let data = new db({
                    guildid: message.guild.id,
                    kanalkoruma: 'true'
                }).save()
                message.reply('Kanal koruma sistemi açıldı!')
                return
            } else {
                data.kanalkoruma = 'true'
                data.save()
                message.reply('Kanal koruma sistemi açıldı!')
                return
            }
        } else if (komut === 'kapat') {
            if (!data || data === null) return message.reply('Kanal koruma zaten kapalı!')
            if (!data || !data.kanalkoruma || data.kanalkoruma === null || data.kanalkoruma === 'false') return message.reply('Kanal koruma zaten kapalı!')
            data.kanalkoruma = 'false'
            data.save()
            message.reply('Kanal koruma sistemi kapatıldı!')
        } else {
            message.reply('Lütfen sadece **aç** veya **kapat** yazınız!')
        }
    })
}

exports.command = {
    name: "kanalkoruma",
    aliases: ["kanal-koruma"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};