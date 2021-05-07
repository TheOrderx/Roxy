exports.run = async (client, message, args) => {
    message.channel.send("**Dikkat!** Botu sunucudan çıkarmak istediğinize emin misiniz? Bu işlem sunucudaki ayarlarınızı sıfırlar! Sıfırlanan ayarlar geri getirilemez!").then( firstMsg => {
        firstMsg.react("✅").then(React1 => {
                firstMsg.react("❌").then(React2 => {
                    const filter = (reaction, user) => { return user.id === message.author.id; };
                    firstMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        const react = collected.first();

                        if(react.emoji.name == "✅"){
                            message.channel.send("Sunucudan ayrılıyorum.").then( msg => {
                                message.guild.leave();
                                return;
                            });
                            return;
                        }

                        if(react.emoji.name == "❌"){
                            firstMsg.delete();
                            return;
                        }

                    }).catch(err => { firstMsg.delete(); });
                })
            })
    })
}

exports.command = {
    name: "sunucudan-ayrıl",
    aliases: ["sunucudanayrıl"],
    category: "util",
    permission: "ADMINISTRATOR",
    cooldown: 59000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};