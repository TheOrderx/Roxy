exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const db = require('../models/genel')

    let komut = args[0]
    db.findOne({ guildid: message.guild.id }, (error, data) => {
        if (komut === 'ayarla') {
            let kanal = message.mentions.channels.first()
            if (!kanal) return message.reply('Lütfen bir kanal etiketleyin!')
            if (!data) {
                let data = new db({
                    guildid: message.guild.id,
                    güvenlikodası: kanal.id
                }).save()
                message.reply(`Güvenlik odası başarıyla ${kanal} olarak ayarlandı!`)
                return
            } else {
                data.güvenlikodası = kanal.id
                data.save()
                message.reply(`Güvenlik odası başarıyla ${kanal} olarak ayarlandı!`)
                return
            }
        } else if (komut === 'kapat') {
            if (!data || data === null) return message.reply('Kanal koruma zaten kapalı!')
            if (!data || !data.güvenlikodası || data.güvenlikodası === null || data.güvenlikodası === 'false') return message.reply('Güvenlik odası zaten kapalı!')
            data.güvenlikodası = 'false'
            data.save()
            message.reply('Güvenlik odası kapatıldı!')
        } else {
            message.reply('Lütfen sadece **ayarla #kanal** veya **kapat** yazınız!')
        }
    })
}

exports.command = {
    name: "güvenlikodası",
    aliases: ["güvenlik-odası"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};