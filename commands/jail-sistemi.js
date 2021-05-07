const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    
    const embed = new Discord.MessageEmbed()
     .setTitle(`${client.user.username} Jail Sistem`)
     .setDescription(`➡️ \`\`${prefix}jail-log #Kanal\`\` | \`\`${prefix}jail-log kapat\`\`\nLog kanalı ayarlarsınız.\n\n➡️ \`\`${prefix}jail-yetkili-rol-ayarla @Rol\`\`\nJail komutlarını kullanbilecek yetkili rolünü ayarlat.\n\n➡️ \`\`${prefix}jail-rol-ayarla\`\`\nKarantina rolü ayarlarsınız.\n\n\n:pencil: **Jail komutu:** \`\`${prefix}jail\`\`\n:ok_hand: **Örnek Jail Komutu:**\`\`\`${prefix}jail @Kullanıcı\`\`\`\n\n:ok_hand: Karantinadan çıkarmak için; \`\`${prefix}k-erkek @Kullanıcı\`\` - \`\`${prefix}k-kadın @Kullanıcı\`\``)
     .setThumbnail(message.author.avatarURL())


     message.channel.send(embed);
    
}

exports.command = {
    name: "jail-sistem",
    aliases: ["jail-sistemi"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 1000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};