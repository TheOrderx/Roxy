const moment = require("moment");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const AdsSchema = require('../models/ServerAds');
    const channel = new Discord.WebhookClient(client.config.Bot.Logs.ServerAds.WebHookID, client.config.Bot.Logs.ServerAds.WebHookTOKEN);

    try {
        const AdsData = await AdsSchema.findOne({ serverID: message.guild.id }).exec();
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Dikkat! Sunucunuzun son tanıtımı üzerinden 24 saat geçmemiş! Yeniden tanıtım yapabilmek için **${AdsData.NextDate}** tarih, **${AdsData.NextTime}** saatini beklemelisiniz.`
            }
        }).catch(err => { return; });
    } catch (err) {
        message.channel.createInvite({ maxAge: 0 }).then(Invite => {
            channel.send(`Sunucu İsmi: **${message.guild.name}**\nÜye Sayısı: **${message.guild.memberCount}**\nDavet Linki: https://discord.gg/${Invite.code}\nSizde beni sunucunuza \`\`${prefix}davet\`\` komutu ile ekleyebilir ve \`\`${prefix}sunucutanıt\`\` komutu ile sunucuzun tanıtımını yapabilirsiniz!`).then(result => {
                const timeData = moment().add(1, "day")
                const obj = {
                    serverID: message.guild.id,
                    moderatorID: message.author.id,
                    moderatorName: message.author.tag,
                    Timeout: 86400000,
                    NextDate: timeData.format("DD/MM/YYYY"),
                    NextTime: timeData.format("HH:mm:ss")
                }
                const push = new AdsSchema(obj);
                push.save((err,doc) => {
                    if(!err){
                        message.channel.send({ embed: {
                            color: `${client.config.Color.Success}`,
                            description: `:white_check_mark: Sunucu tanıtımı başarı ile gönderildi.`
                        }}).catch(err => { return; });
                        return;
                    }
                })
            })
        }).catch(err => {
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Error}`,
                    description: `:warning: Davet linki oluşturulamadı.`
                }
            }).catch(err => { return; });
        })
    }
}

exports.command = {
    name: "sunucu-tanıt",
    aliases: ["sunucutanıt"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};