exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);

    message.channel.send({ embed: {
        color: `RANDOM`,
        description: `:tada: ${client.user.username} Davet Sayaç Sistemi\n\n▶️\`\`${prefix}davet-kanal-ayarla\`\` Davet sistemi mesajları için kanal ayarlar.\n\n▶️\`\`${prefix}davet-giriş-mesaj-ayarla\`\` Sunucuya kullanıcı giriş yaptığında gönderilecek mesajı ayarlar.\n\n▶️\`\`${prefix}davet-çıkış-mesaj-ayarla\`\` Kullanıcı çıkış yaptığunda gönderilecek mesajı ayarlar.\n\n▶️\`\`${prefix}davet-kaldır\`\` Davetiye sayaç sisteminin **bütün ayarlarını** sıfırlar.`
    }})    
} 

exports.command = {
    name: "davetsayaç",
    aliases: ["davet-sayaç"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};