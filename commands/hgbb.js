exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const HgBbSchema = require('../models/HgBb');
    const process = args[0];
    const content = args.slice(1).join(" ");

    if (!process) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen yapmak istediğiniz işlemi belirtin.`
            }
        }).catch(err => { return client.Error(message,"hgbb",err); });
        return;
    }

    if (process.toLowerCase() == "kaldır") {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:question: Hoşgeldin, Görüşürüz mesaj sistemini kapatmak istediğinize emin misiniz?`
            }
        }).then(firstMsg => {
            firstMsg.react("✅").then(React1 => {
                firstMsg.react("❌").then(React2 => {
                    const filter = (reaction, user) => { return user.id === message.author.id; };
                    firstMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first();
                        firstMsg.reactions.removeAll().catch(err => { return client.Error(message,"hgbb:kaldır",err); });
                        if (reaction.emoji.name == "✅") {
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Loading}`,
                                    description: `:timer: Lütfen bekleyin, yaptığınız ayarlar sıfırlanıyor.`
                                }
                            }).then(async msg => {
                                try {
                                    await HgBbSchema.findOneAndDelete({ serverID: message.guild.id }).exec();
                                    firstMsg.edit({
                                        embed: {
                                            color: `${client.config.Color.Success}`,
                                            description: `:white_check_mark: Ayarlar başarı ile sıfırlandı.`
                                        }
                                    }).catch(err => { return client.Error(message,"hgbb:kaldır",err); });
                                    return;
                                } catch (err) {
                                    firstMsg.edit({
                                        embed: {
                                            color: `${client.config.Color.Error}`,
                                            description: `:x: İşlem sırasında bir hata oluştu, lütfen daha sonra tekrar deneyiniz.`
                                        }
                                    }).catch(err => { return client.Error(message,"hgbb:kaldır",err); });
                                    return;
                                }
                            }).catch(err => { return client.Error(message,"hgbb:kaldır",err); });
                            return;
                        }

                        if (reaction.emoji.name == "❌") {
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Error}`,
                                    description: `:x: İşlem kullanıcı tarafından iptal edildi.`
                                }
                            }).catch(err => { return client.Error(message,"hgbb:kaldır",err); });
                            return;
                        }

                        if (reaction.emoji.name != "✅" || reaction.emoji.name != "❌") {
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Error}`,
                                    description: `:x: Belirtilenlerden farklı bir reaksiyon eklendi, işlem iptal edildi.`
                                }
                            }).catch(err => { return client.Error(message,"hgbb:kaldır",err); });
                            return;
                        }
                    }).catch(err => {
                        firstMsg.edit({
                            embed: {
                                color: `${client.config.Color.Error}`,
                                description: `:x: 30 saniye içerisinde seçim yapmadığınız için işlem iptal edildi.`
                            }
                        }).catch(err => { return client.Error(message,"hgbb:kaldır",err); });
                        firstMsg.reactions.removeAll();
                    });
                }).catch(err => { return client.Error(message,"hgbb:kaldır",err); });
            }).catch(err => { return client.Error(message,"hgbb:kaldır",err); });
        }).catch(err => { return client.Error(message,"hgbb:kaldır",err); });
        return;
    }

    if (process.toLowerCase() == "kanal-ayarla") {
        const channel = message.mentions.channels.first();
        if (!channel) {
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Info}`,
                    description: `:warning: Lütfem bir kanal etiketleyerek komutu tekrar kullanın!`
                }
            }).catch(err => { return client.Error(message,"hgbb:kanalayarla",err); });
            return;
        }

        if (channel.type != "text") {
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Info}`,
                    description: `:warning: Lütfen bir yazı kanalı etiketleyin.`
                }
            }).catch(err => { return client.Error(message,"hgbb:kanalayarla",err); });
            return;
        }

        channel.send(`:warning: Bot yetki test deneme mesajıdır! Ayarlama tamamlandığında otomatik olarak silinecektir.`, { embed: { color: `${client.config.Color.Error}` } }).then(async permissiınMessage => {
            try {
                const HgBbData = await HgBbSchema.findOne({ serverID: message.guild.id }).exec();
                HgBbData.ChannelID = channel.id
                HgBbData.save((err, doc) => {
                    if (!err) {
                        message.channel.send({
                            embed: {
                                color: `${client.config.Color.Success}`,
                                description: `:white_check_mark: Kanal ayarı başarı ile günellendi. Yetki test mesajı silinecek, lütfen bekleyin.`
                            }
                        }).catch(err => { return client.Error(message,"hgbb:kanalayarla",err); });
                        permissiınMessage.delete({ timeout: 3000 }).catch(err => { return client.Error(message,"hgbb:kanalayarla",err); });
                        return;
                    }

                    if (err) {
                        message.channel.send({
                            embed: {
                                color: `${client.config.Color.Error}`,
                                description: `:x: İşlem sırasında bir hata oluştu, lütfen daha sonra tekrar deneyiniz.`
                            }
                        }).catch(err => { return client.Error(message,"hgbb:kanalayarla",err); });
                        return;
                    }
                });
            } catch (err) {
                const obj = {
                    serverID: message.guild.id,
                    ChannelID: channel.id,
                    HGContent: `Hoşgeldin {user.etiket}!`,
                    BBContent: `Görüşürüz {user.name}`
                }
                const push = new HgBbSchema(obj);
                push.save((err, doc) => {
                    if (!err) {
                        message.channel.send({
                            embed: {
                                color: `${client.config.Color.Success}`,
                                description: `:white_check_mark: İlk kurulum başarı ile tamamlandı mesaj içeriğini değiştirmek için lütfen komut yardımına göz atın. Yetki test mesajı silinecek, lütfen bekleyin.`
                            }
                        }).catch(err => { return; });
                        permissiınMessage.delete({ timeout: 3000 }).catch(err => { return client.Error(message,"hgbb:kanalayarla",err); });
                        return;
                    }

                    if (err) {
                        message.channel.send({
                            embed: {
                                color: `${client.config.Color.Error}`,
                                description: `:x: İşlem sırasında bir hata oluştu, lütfen daha sonra tekrar deneyiniz.`
                            }
                        }).catch(err => { return client.Error(message,"hgbb:kanalayarla",err); });
                        return;
                    }
                })
            }
        }).catch(err => {
            console.log(err);
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Error}`,
                    description: `:warning: Etiketlediğiniz kanala bot tarafından mesaj gönderilemiyor, lütfen yetkileri kontrol ediniz.`
                }
            }).catch(err => { return client.Error(message,"hgbb:kanalayarla",err); });
            return;
        });
        return;
    }

    if (process.toLowerCase() == "hoşgeldin-mesaj-ayarla" || process.toLowerCase() == "hma") {
        const Data = await HgBbSchema.findOne({ serverID: message.guild.id }).exec();
        try {
            if (!content) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen hoşgeldin mesajlarında gönderilecek mesaj içeriğini belirterek tekrar deneyiniz.`,
                        fields: [
                            {
                                name: "Eklenebilecek Argümanlar:",
                                value: "``{user.etiket}`` -> Mesaj içeriğinde sunucuya giren kullanıcıyı etiketler.\n\`\`{user.name}\`\` -> Sunucuya giren kullanıcının tagını yazar."
                            },
                            {
                                name: "Uyarı:",
                                value: `▶️ Her bir etiket sadece bir defa kullanılabilir, bir argümandan iki tane olması durumunda birisi çalışmayacaktır.\n▶️ Ayarlama işlemini tamamladığınızda \`\`${prefix}hgbb test\`\` komutu ile değişiklikleri görüntüleyebilrisiniz.`
                            },
                            {
                                name: "Güncel Mesaj İçeriği:",
                                value: `${Data.HGContent}`
                            }
                        ]
                    }
                }).catch(err => { return client.Error(message,"hgbb:mesajayarlama",err); });
                return;
            }

            Data.HGContent = content;
            Data.save((err, doc) => {
                if (!err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Success}`,
                            description: `:white_check_mark: Hoşgeldin mesaj içeriği başarı ile güncellendi. Test etmek için \`\`${prefix}hgbb test hoşgeldin\`\` komutunu kullanabilirsiniz.`
                        }
                    }).catch(err => { return client.Error(message,"hgbb:mesajayarla",err); });
                    return;
                }

                if (err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:x: İşlem sırasında bir hata oluştu, lütfen daha sonra tekrar deneyiniz.`
                        }
                    }).catch(err => { return client.Error(message,"hgbb:mesajayarla",err); });
                    return;
                }
            });

        } catch (err) {
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Error}`,
                    description: `:warning: Hoşgeldin, görüşürüz mesaj kanalı ayarı bulunamadı, lütfen \`\`${prefix}hgbb kanal-ayarla #Kanal\`\` komutu ile gerekli ayarı yapınız.`
                }
            }).catch(err => { return client.Error(message,"hgbb:mesajayarla",err); });
            return;
        }
    }

    if (process.toLowerCase() == "görüşürüz-mesaj-ayarla" || process.toLowerCase() == "gma") {
        const Data = await HgBbSchema.findOne({ serverID: message.guild.id }).exec();
        try {
            if (!content) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen görüşürüz mesajlarında gönderilecek mesaj içeriğini belirterek tekrar deneyiniz.`,
                        fields: [
                            {
                                name: "Eklenebilecek Argümanlar:",
                                value: "\`\`{user.name}\`\` -> Sunucudan çıkan kullanıcının tagını yazar."
                            },
                            {
                                name: "Uyarı:",
                                value: `▶️ Her bir etiket sadece bir defa kullanılabilir, bir argümandan iki tane olması durumunda birisi çalışmayacaktır.\n▶️ Ayarlama işlemini tamamladığınızda \`\`${prefix}hgbb test\`\` komutu ile değişiklikleri görüntüleyebilrisiniz.`
                            },
                            {
                                name: "Güncel Mesaj İçeriği:",
                                value: `${Data.BBContent}`
                            }
                        ]
                    }
                }).catch(err => { return client.Error(message,"hgbb:mesajayarla",err); });
                return;
            }

            Data.BBContent = content;
            Data.save((err, doc) => {
                if (!err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Success}`,
                            description: `:white_check_mark: Görüşürüz mesaj içeriği başarı ile güncellendi. Test etmek için \`\`${prefix}hgbb test görüşürüz\`\` komutunu kullanabilirsiniz.`
                        }
                    }).catch(err => { return client.Error(message,"hgbb:mesajayarla",err); });
                    return;
                }

                if (err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:x: İşlem sırasında bir hata oluştu, lütfen daha sonra tekrar deneyiniz.`
                        }
                    }).catch(err => { return client.Error(message,"hgbb:mesajayarla",err); });
                    return;
                }
            });

        } catch (err) {
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Error}`,
                    description: `:warning: Hoşgeldin, görüşürüz mesaj kanalı ayarı bulunamadı, lütfen \`\`${prefix}hgbb kanal-ayarla #Kanal\`\` komutu ile gerekli ayarı yapınız.`
                }
            }).catch(err => { return client.Error(message,"hgbb:mesajayarla",err); });
            return;
        }
    }

    if (process == "status") {
        const Data = await HgBbSchema.findOne({ serverID: message.guild.id }).exec();
        try {
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Info}`,
                    description: `Hoşgeldin, görüşürüz mesaj sistemi ayarları aşağıda yer almaktadır.`,
                    fields: [
                        {
                            name: `Mesaj Kanalı`,
                            value: `#${message.guild.channels.cache.get(Data.ChannelID).name}`
                        },
                        {
                            name: `Hoşgeldin Mesajı:`,
                            value: `${Data.HGContent}`
                        },
                        {
                            name: `Görüşürüz Mesajı:`,
                            value: `${Data.BBContent}`
                        },
                        {
                            name: "Bilgilendirme:",
                            value: `Mesaj içeriklerini görüntülemek için \`\`${prefix}hgbb test\`\` komutunu kullanabilirsiniz.`
                        }
                    ]
                }
            })
        } catch (err) {
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Error}`,
                    description: `:warning: Sunucu için hoşgeldin, görüşürüz mesajları ayarlanmamış!`
                }
            }).catch(err => { return client.Error(message,"hgbb:status",err); });
            return;
        }
    }

    if (process == "test") {
        if (!args[1]) {
            client.emit("guildMemberAdd", message.guild.members.cache.get(client.user.id));
            setTimeout(function () { client.emit("guildMemberRemove", message.guild.members.cache.get(client.user.id)); }, 3000);
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Success}`,
                    description: `:white_check_mark: Test başarılı!`
                }
            }).catch(err => { return client.Error(message,"hgbb:test",err); });
            return;
        }

        if (args[1] == "hoşgeldin") {
            client.emit("guildMemberAdd", message.guild.members.cache.get(client.user.id));
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Success}`,
                    description: `:white_check_mark: Test başarılı!`
                }
            }).catch(err => { return client.Error(message,"hgbb:test",err); });
            return;
        }

        if (args[1] == "görüşürüz") {
            client.emit("guildMemberRemove", message.guild.members.cache.get(client.user.id));
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Success}`,
                    description: `:white_check_mark: Test başarılı!`
                }
            }).catch(err => { return client.Error(message,"hgbb:test",err); });
            return;
        }
        return;
    }
}

exports.command = {
    name: "hgbb",
    aliases: ["hosgeldin-gorusuruz"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};