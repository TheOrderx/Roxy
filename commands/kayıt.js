const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    
    const embed = new Discord.MessageEmbed()
     .setTitle(`${client.user.username} Kullanıcı Kayıt Sistem`)
     .setDescription(`➡️ \`\`${prefix}kayıt-kanal #Kanal\`\` - Kayıt kanalı ayarlarsınız. (Kayıt komutları sadece bu kanalda kullanılabilir.)\n➡️ \`\`${prefix}kayıt-mesaj-ayarla\`\` - Sunucuya kullanıcı giriş yaptığında gönderilecek olan mesajı ayarlarsınız.\n➡️\`\`${prefix}kayıtsız-rol-ayarla\`\` - Henüz kayıt olmayan kullanıcılara verilecek rolü ayarlarsınız.\n➡️ \`\`${prefix}kayıt-erkek-rol-ayarla\`\` - Kayıt sistemi için erkek rolünü ayarlarsınız.\n➡️ \`\`${prefix}kayıt-kız-rol-ayarla\`\` - Kayıt sistemi için kız rolünü ayarlarsınız.\n➡️ \`\`${prefix}kayıt-yetkili-rol-ayarla\`\` - Kayıt işlerinden sorumlu yetkililerin rolünü ayarlar.\n➡️ \`\`${prefix}kayıt-kaldır\`\` - Kayıt sistemi ayarlarını sıfırlamanızı sağlar. **Bu işlem geri alınamaz!**`)
     .setThumbnail(message.author.avatarURL())


     message.channel.send(embed);
} 

exports.command = {
    name: "kayıt",
    aliases: ["register"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};