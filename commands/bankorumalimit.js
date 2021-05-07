exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const db = require('../models/genel')

    let limit = args[0]
    if (!limit) return message.reply('Lütfen bir limit giriniz!')
    if (isNaN(limit)) return message.reply('Sadece rakam yazabilirsiniz!')
    if (limit === '0') return message.reply('Limit asla 0 olamaz!')
    db.findOne({ guildid: message.guild.id }, (error, data) => {
        if (!data || data === null) return message.reply('Ban koruma sistemi kapalı olduğundan bu komut kullanılamaz')
        if (!data || !data.bankoruma || data.bankoruma === null || data.bankoruma === 'false') return message.reply('Ban koruma sistemi kapalı olduğundan bu komut kullanılamaz')
        data.bankorumalimit = limit
        data.save()
        message.reply(`Ban koruma limit ${limit} olarak ayarlandı!`)
    })
}

exports.command = {
    name: "bankoruma-limit",
    aliases: ["ban-koruma-limit","bankorumalimit"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};