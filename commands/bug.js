const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const oneri = args.slice(0).join(" ");
    const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    if(!oneri){
        message.channel.send({ embed: {
            color: `${client.config.Color.Info}`,
            description: `:warning: Lütfen bildirmek istediğiniz hatayı detaylı bir şekilde açıklayarak komutu tekrar kullanın! \n\`\`${prefix}bug <HataBildirimİçerik>\`\``
        }}).catch(err => { return client.Error(message,"bug",err); });
        return;
    }

    if(regex.test(oneri)){
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Dikkat! Hata bildirimi mesaj içeriğine link ekleyemezsiniz. Resim vb. içerik eklemek isterseniz dosya olarak komut ile birlikte yüklemelisiniz.`
        }}).catch(err => { return client.Error(message,"bug",err); });
        return;
    }

    const oneriEmbed = new Discord.MessageEmbed()
     .setAuthor(message.author.tag,message.author.avatarURL())
     .setDescription(`_${message.author.tag} (\`\`${message.author.id}\`\`) adlı kullanıcıdan yeni hata bildirimi._\n**Açıklama:** ${oneri}`)
    
    if(message.attachments.first()){
        oneriEmbed.addField("Doküman:", `[Link](${message.attachments.first().proxyURL})`, true);
    }

    message.channel.send({ embed: {
        color: `${client.config.Color.Loading}`,
        description: `:question: Belirttiğiniz hata bildirimini göndermek istediğiniz emin misiniz? \n**Hata İçeriği:** ${oneri}`
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
                                description: `:timer: Hata bildirimi gönderiliyor, lütfen bekleyin...`
                            }
                        }).then(secondMsg => {
                            firstMsg.reactions.removeAll();
                            const hook = new Discord.WebhookClient(client.config.Bot.Logs.Bug.WebHookID, client.config.Bot.Logs.Bug.WebHookTOKEN); 
                            hook.send(oneriEmbed)
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Success}`,
                                    description: `:white_check_mark: Bug bildirimi başarı ile destek sunucusuna gönderildi!`
                                }
                            }).catch(err => { return client.Error(message,"bug",err); });
                        }).catch(err => { return client.Error(message,"bug",err); });
                    } else if (reaction.emoji.name == "❌") {
                        firstMsg.edit({
                            embed: {
                                color: `${client.config.Color.Success}`,
                                description: `:white_check_mark: Bug bildirim gönderme işlemi iptal edildi!`
                            }
                        }).then(secondMsg => {
                            firstMsg.reactions.removeAll();
                            return;
                        }).catch(err => { return client.Error(message,"bug",err); });
                    } else {
                        firstMsg.edit({
                            embed: {
                                color: `${client.config.Color.Error}`,
                                description: `:x: Belirtilenlerden farklı bir reaksiyon verildi, işlem iptal edildi.`
                            }
                        }).catch(err => { return client.Error(message,"bug",err); });
                        firstMsg.reactions.removeAll();
                        return;
                    }
                }).catch(err => {
                    firstMsg.edit({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:x: 30 saniye içerisinde seçim yapmadığınız için işlem iptal edildi.`
                        }
                    }).catch(err => { return client.Error(message,"bug",err); });
                    firstMsg.reactions.removeAll();
                });
            }).catch(err => { return client.Error(message,"bug",err); });
        }).catch(err => { return client.Error(message,"bug",err); });
    }).catch(err => { return client.Error(message,"bug",err); });
}

exports.command = {
    name: "bug",
    aliases: ["böcek","hata","bildirim"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 60000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};