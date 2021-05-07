const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    
    const embed = new Discord.MessageEmbed()
     .setTitle(`${client.user.username} Uyarı Sistem`)
     .setDescription(`➡️ \`\`${prefix}uyar\`\` - Bir kullanıcıyı uyarmanızı sağlar.\n➡️ \`\`${prefix}uyarılar\`\` - Kullanıcı uyarılarını listeler. \n➡️ \`\`${prefix}uyarı-sil\`\` - ID numarası yazılan uyarıyı siler. \n➡️ \`\`${prefix}uyarı-rol-ayarla\`\` - Uyarılan kullanıcılara verilecek rolü ayarlar.`)
     .setThumbnail(message.author.avatarURL())


     message.channel.send(embed);
} 

exports.command = {
    name: "uyarı-sistem",
    aliases: ["uyarı-sistemi"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};