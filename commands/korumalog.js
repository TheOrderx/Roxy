const db = require('../models/genel');

exports.run = async (client, message, args) => {
    let komut = args[0]

    db.findOne({ guildid: message.guild.id }, (error, data) => {

        if (komut === 'ayarla') {
            let kanal = message.mentions.channels.first()
            if (!kanal) return message.reply('Lütfen bir kanal etiketleyin!')
            if (!data) {
                let data = new db({
                    guildid: message.guild.id,
                    korumalog: kanal.id
                }).save()
                message.reply(`Koruma log başarıyla ${kanal} olarak ayarlandı!`)
                return
            } else {
                data.korumalog = kanal.id
                data.save()
                message.reply(`Koruma log başarıyla ${kanal} olarak ayarlandı!`)
                return
            }


        } else if (komut === 'kapat') {
            if (!data || data === null) return message.reply('Koruma log sistemi zaten kapalı!')
            if (!data || !data.korumalog || data.korumalog === null || data.korumalog === 'false') return message.reply('Koruma log sistemi zaten kapalı!')

            data.korumalog = 'false'
            data.save()
            message.reply('Koruma log sistemi kapatıldı!')
        } else {
            message.reply('Lütfen sadece **ayarla #kanal** veya **kapat** yazınız!')
        }

    })
}

exports.command = {
    name: "korumalog",
    aliases: ["koruma-log"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};