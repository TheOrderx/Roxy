exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const PrefixSchema = require('../models/Prefix');
    const Prefix = args[0];
    if (!Prefix) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen yeni prefixinizi belirtin, ayarı kapatmak istiyorsanız lütfen kapat yazın. \n\`\`${prefix}prefix <YeniPrefix>\`\` - \`\`${prefix}prefix kapat\`\``
            }
        }).catch(err => { return; });
        return;
    }

    if ((Prefix.length > 5) == true && Prefix != "kapat") {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Belirttiğiniz prefix çok uzun, lütfen daha kısa bir prefix belirtin. (5 karakterden az olmalı)`
            }
        }).catch(err => { return; });
        return;
    }

    if (Prefix == "kapat") {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:question: Sunucunuz için özelleştirilmiş ön-ek ayarını (\`\`${prefix}\`\`) sıfırlamak istediğinze emin misiniz?`
            }
        }).then(firstMsg => {
            firstMsg.react("✅").then(React1 => {
                firstMsg.react("❌").then(React2 => {
                    const filter = (reaction, user) => { return user.id === message.author.id; };
                    firstMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name == "✅") {
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Loading}`,
                                    description: `:timer: Prefix ayarı kapatılıyor, lütfen bekleyin...`
                                }
                            }).then(secondMsg => {
                                firstMsg.reactions.removeAll();
                                PrefixSchema.findOneAndDelete({ serverID: message.guild.id }).exec();
                                firstMsg.edit({
                                    embed: {
                                        color: `${client.config.Color.Success}`,
                                        description: `:white_check_mark: Ayarlar başarı ile sıfırlandı.`
                                    }
                                }).catch(err => { return; });
                            }).catch(err => { return; });
                        } else if (reaction.emoji.name == "❌") {
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Success}`,
                                    description: `:white_check_mark: Ayarları kapatma işlemi iptal edildi, tekrar bizi tercih ettiğiniz için teşekkür ederiz!`
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
        return;
    }

    if (Prefix.includes("`") || Prefix.includes(":")) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Belirtmiş olduğunuz prefix içerisinde engellenmiş argümanlar mevcut. Lütfen tekrar deneyin.`
            }
        }).catch(err => { return; });
        return;
    }

    try{
        const PrefixData = await PrefixSchema.findOne({ serverID: message.guild.id }).exec();
        PrefixData.Prefix = Prefix
        PrefixData.save((err,doc) => {
            if(!err){
                message.channel.send({ embed: {
                    color: `${client.config.Color.Success}`,
                    description: `:white_check_mark: Sunucu içi ön-ek ayarınız başarı ile güncellendi. \`\`${prefix}yardım\`\` yazarak komutları görebilisiniz.`
                }}).catch(err => { return; });
                return;
            }
            if(err){
                message.channel.send({ embed: {
                    color: `${client.config.Color.Error}`,
                    description: `:warning: İşlem sırasında bir hata oluştu, lütfen daha sonra tekrar deneyin.`
                }}).catch(err => { return; });
                return;
            }
        })
    }catch(err){
        const obj = { serverID: message.guild.id, Prefix: Prefix };
        const push = new PrefixSchema(obj);
        push.save((err,doc) => {
            if(!err){
                message.channel.send({ embed: {
                    color: `${client.config.Color.Success}`,
                    description: `:white_check_mark: Sunucu içi ön-ek ayarınız başarı ile güncellendi. \`\`${doc.Prefix}yardım\`\` yazarak komutları görebilisiniz.`
                }}).catch(err => { return; });
                return;
            }
            if(err){
                message.channel.send({ embed: {
                    color: `${client.config.Color.Error}`,
                    description: `:warning: İşlem sırasında bir hata oluştu, lütfen daha sonra tekrar deneyin.`
                }}).catch(err => { return; });
                return;
            }
        });
    }
}

exports.command = {
    name: "prefix",
    aliases: ["prefix-ayarla", "ön-ek-değiştir", "ön-ek-ayarla", "prefix-değiştir", "set-prefix"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 10000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};