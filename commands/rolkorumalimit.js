exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const db = require('../models/genel')

    let limit = args[0]
    if (!limit) return message.reply('Lütfen bir limit giriniz!')
    if (isNaN(limit)) return message.reply('Sadece rakam yazabilirsiniz!')
    if (limit === '0') return message.reply('Limit asla 0 olamaz!')


    db.findOne({ guildid: message.guild.id }, (error, data) => {

        if (!data || data === null) return message.reply('Rol koruma sistemi kapalı olduğundan bu komut kullanılamaz')
        if (!data || !data.rolkoruma || data.rolkoruma === null || data.rolkoruma === 'false') return message.reply('Rol koruma sistemi kapalı olduğundan bu komut kullanılamaz')

        data.rolkorumalimit = limit
        data.save()

        message.reply(`Rol koruma limit ${limit} olarak ayarlandı!`)
    })
}

exports.command = {
    name: "rolkoruma-limit",
    aliases: ["rol-korumalimit", "rolkorumalimit"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};