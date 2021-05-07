const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const oneri = args.slice(0).join(" ");
    const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    if(!oneri){
        message.channel.send({ embed: {
            color: `${client.config.Color.Info}`,
            description: `:warning: Lütfen göndermek istediğiniz öneriyi belirterek komutu tekrar kullanın! \n\`\`${prefix}öneri <Öneriİçerik>\`\``
        }}).catch(Err => { return; });
        return;
    }

    if(regex.test(oneri)){
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Dikkat! Öneri içeriğine link ekleyemezsiniz. Resim vb. içerik eklemek isterseniz dosya olarak komut ile birlikte yüklemelisiniz.`
        }}).catch(err => { return; });
        return;
    }

    const oneriEmbed = new Discord.MessageEmbed()
     .setAuthor(message.author.tag,message.author.avatarURL())
     .setDescription(`_${message.author.tag} (\`\`${message.author.id}\`\`) adlı kullanıcıdan yeni öneri._\n**Öneri:** ${oneri}`)
    
    if(message.attachments.first()){
        oneriEmbed.addField("Doküman:", message.attachments.first().proxyURL, true);
    }

    message.channel.send({ embed: {
        color: `${client.config.Color.Loading}`,
        description: `:question: Belirttiğiniz öneriyi göndermek istediğiniz emin misiniz? \n**Öneri İçeriği:** ${oneri}`
    }}).then( firstMsg => {
        firstMsg.react("✅").then(React1 => {
            firstMsg.react("❌").then(React2 => {
                const filter = (reaction, user) => { return user.id === message.author.id; };
                firstMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    if (reaction.emoji.name == "✅") {
                        firstMsg.edit({
                            embed: {
                                color: `${client.config.Color.Loading}`,
                                description: `:timer: Öneri gönderiliyor, lütfen bekleyin...`
                            }
                        }).then(secondMsg => {
                            firstMsg.reactions.removeAll();
                            const hook = new Discord.WebhookClient(client.config.Bot.Logs.Suggestion.WebHookID, client.config.Bot.Logs.Suggestion.WebHookTOKEN); 
                            hook.send(oneriEmbed)
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Success}`,
                                    description: `:white_check_mark: Öneri başarı ile destek sunucusuna gönderildi!`
                                }
                            }).catch(err => { return; });
                        }).catch(err => { return; });
                    } else if (reaction.emoji.name == "❌") {
                        firstMsg.edit({
                            embed: {
                                color: `${client.config.Color.Success}`,
                                description: `:white_check_mark: Öneri gönderme işlemi iptal edildi!`
                            }
                        }).then(secondMsg => {
                            firstMsg.reactions.removeAll();
                            return;
                        }).catch(err => { return; });
                    } else {
                        firstMsg.edit({
                            embed: {
                                color: `${client.config.Color.Error}`,
                                description: `:x: Belirtilenlerden farklı bir reaksiyon verildi, işlem iptal edildi.`
                            }
                        }).catch(err => { return; });
                        firstMsg.reactions.removeAll();
                        return;
                    }
                }).catch(err => {
                    firstMsg.edit({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:x: 30 saniye içerisinde seçim yapmadığınız için işlem iptal edildi.`
                        }
                    }).catch(err => { return; });
                    firstMsg.reactions.removeAll();
                });
            }).catch(err => { return; });
        }).catch(err => { return; });
    }).catch(err => { return; });
}

exports.command = {
    name: "öneri",
    aliases: ["suggestion","öner","tavsiye","bildiri"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 30000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};