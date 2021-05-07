exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const db = require('../models/genel')

    let komut = args[0]

    db.findOne({ guildid: message.guild.id }, (error, data) => {

        if (komut === 'aç') {
            if (!data) {
                let data = new db({
                    guildid: message.guild.id,
                    reklamengel: 'true'
                }).save()
                message.reply(`Reklam engel açıldı!`)
                return
            } else {
                data.reklamengel = 'true'
                data.save()
                message.reply(`Reklam engel açıldı!`)
                return
            }


        } else if (komut === 'kapat') {
            if (!data || data === null) return message.reply('Reklam engel sistemi zaten kapalı!')
            if (!data || !data.reklamengel || data.reklamengel === null || data.reklamengel === 'false') return message.reply('Reklam engel sistemi zaten kapalı!')

            data.reklamengel = 'false'
            data.save()
            message.reply('Reklam engel sistemi kapatıldı!')
        } else {
            message.reply('Lütfen sadece **aç** veya **kapat** yazınız!')
        }

    })
}

exports.command = {
    name: "reklamengel",
    aliases: ["reklam-koruma", "reklamkoruma"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};