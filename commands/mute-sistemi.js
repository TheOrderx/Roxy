const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    
    const embed = new Discord.MessageEmbed()
     .setTitle(`${client.user.username} Susturma Ceza Sistem`)
     .setDescription(`➡️ \`\`${prefix}mute\`\` - Bir kullanıcıyı susturmanızı sağlar.\n➡️ \`\`${prefix}unmute\`\` - Kullanıcıya verilmiş susturma cezasını kaldırır.\n➡️ \`\`${prefix}mute-rol-ayarla\`\` - Susturulan kullanıcılara verilecek rolü ayarlar.`)
     .setThumbnail(message.author.avatarURL())


     message.channel.send(embed);
} 

exports.command = {
    name: "mute-sistem",
    aliases: ["mute-sistemi"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};