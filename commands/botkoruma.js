exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const db = require('../models/genel')

    let komut = args[0]
    db.findOne({ guildid: message.guild.id }, (error, data) => {
        if (komut === 'aç') {
            if (!data) {
                let data = new db({
                    guildid: message.guild.id,
                    botkoruma: 'true'
                }).save()
                message.reply('Bot koruma sistemi açıldı!')
                return
            } else {
                data.botkoruma = 'true'
                data.save()
                message.reply('Bot koruma sistemi açıldı!')
                return
            }
        } else if (komut === 'kapat') {
            if (!data || data === null) return message.reply('Bot koruma zaten kapalı!')
            if (!data || !data.botkoruma || data.botkoruma === null || data.botkoruma === 'false') return message.reply('Bot koruma zaten kapalı!')
            data.botkoruma = 'false'
            data.save()
            message.reply('Bot koruma sistemi kapatıldı!')
        } else {
            message.reply('Lütfen sadece **aç** veya **kapat** yazınız!')
        }
    })
}

exports.command = {
    name: "botkoruma",
    aliases: ["bot-koruma"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};