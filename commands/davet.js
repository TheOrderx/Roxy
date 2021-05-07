exports.run = async (client, message, args) => {
    message.channel.send({ embed: {
        color: `RANDOM`,
        description: `> Botun rolünü en üstte tutmayı unutmayınız! (\`\`@${client.user.username}\`\`)\n\n**▶️ [Bot Davet Linki](https://discord.com/oauth2/authorize?client_id=755755342339768350&scope=bot&permissions=8) | ▶️ [Destek Sunucusu](https://discord.gg/rRdyePq)**`
    }}).catch(err => { client.Error(message,"davet",err); })
}

exports.command = {
    name: "davet",
    aliases: ["davet-et"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 1000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};