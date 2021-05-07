exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const db = require('../models/genel')

    let limit = args[0]
    if (!limit) return message.reply('Lütfen bir limit giriniz!')
    if (isNaN(limit)) return message.reply('Sadece rakam yazabilirsiniz!')
    if (limit === '0') return message.reply('Limit asla 0 olamaz!')


    db.findOne({ guildid: message.guild.id }, (error, data) => {
        if (!data || data === null) return message.reply('Kanal koruma sistemi kapalı olduğundan bu komut kullanılamaz')
        if (!data || !data.kanalkoruma || data.kanalkoruma === null || data.kanalkoruma === 'false') return message.reply('Kanal koruma sistemi kapalı olduğundan bu komut kullanılamaz')
        data.kanalkorumalimit = limit
        data.save()
        message.reply(`Kanal koruma limit ${limit} olarak ayarlandı!`)
    })
}

exports.command = {
    name: "kanalkoruma-limit",
    aliases: ["kanal-korumalimit","kanalkorumalimit"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};