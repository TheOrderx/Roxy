const fs = require("fs");
const ms = require("ms");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);

    if (client.randomAvatar.get(`avatar_${message.guild.id}`) != null) {
        client.randomAvatar.delete(`avatar_${message.guild.id}`);
        message.channel.send(`Random avatar gönderimi durduruldu.`);
        return;
    }

    fs.readFile("./avatars.txt", async function (err, data) {
        var lines = data.toString().split('\n');
        const randomAv = await data.toString().split('\n')[Math.floor(Math.random() * lines.length)];

        if (err) {
            client.Error(message, "randomavatar", err);
            return;
        }

        if (!args[0]) {
            const ImageEmbed = new Discord.MessageEmbed()
                .setImage(randomAv)
                .setColor("RANDOM")

            message.channel.send(ImageEmbed).catch(err => { client.Error(message, "randomavatar", err); });
            return;
        }

        if (args[0]) {
            const time = args[0].replace("dk", "m").replace("sn", "s");
            const msData = ms(time);

            if (!msData || msData == null || isNaN(msData)) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen geçerli bir zaman dilimi belirtin.`
                    }
                }).catch(err => { client.Error(message, "randomavatar", err); });
                return;
            }

            if ((msData < ms("1m")) == true || (msData > ms("60m")) == true) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Error}`,
                        description: `:warning: **Dikkat!** Belirtilen süre 1 dakikadan az, 60 dakikadan fazla olamaz. Lütfen dikkat ederek tekrar deneyin.`
                    }
                }).catch(err => { client.Error(message, "randomavatar", err); });
                return;
            }

            const ImageEmbed = new Discord.MessageEmbed()
                .setImage(randomAv)
                .setColor("RANDOM")
                .setFooter(`Random avatar ${args[0]} süre aralıklarda gönderilecektir. Durdurmak için komutu süre olmadan tekrar kullanabilirsiniz.`);

            message.channel.send(ImageEmbed).catch(err => { client.Error(message, "randomavatar", err); });
            client.randomAvatar.set(`avatar_${message.guild.id}`, message.author.id);

            setInterval(function () {
                if (client.randomAvatar.get(`avatar_${message.guild.id}`) == null) return;
                const ImageEmbed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setFooter(`${message.author.tag} tarafından istendi.`)
                    .setImage(data.toString().split('\n')[Math.floor(Math.random() * lines.length)])

                message.channel.send(ImageEmbed).catch(err => { 
                    client.Error(message, "randomavatar", err); 
                    client.randomAvatar.delete(`avatar_${message.guild.id}`);
                });
                return;
            }, msData);

        } else {
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Info}`,
                    description: `:warning: Lütfen belirttiğiniz sürenin doğru/geçerli olduğundan emin olarak tekrar deneyin.\n**Örnek:** \`\`${prefix}randomavatar 1dk\`\``
                }
            }).catch(err => { client.Error(message, "randomavatar", err); });
        }
    })
}

exports.command = {
    name: "randomavatar",
    aliases: ["randmavatar", "rastgele-avatar", "rastgeleavatar"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 10000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};