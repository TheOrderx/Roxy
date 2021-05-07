exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const ModSchema = require('../models/ModerationLogs');
    const muteSchema = require('../models/Mute');
    const Data = await ModSchema.findOne({ serverID: message.guild.id }).exec();
    const User = message.mentions.users.first();
    const Reason = args.slice(1).join(" ");

    if (!User) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen susturulacak kullancıyı etiketleyerek tekrar deneyin.`
            }
        }).catch(err => { client.Error(message, "mute", err); });
        return;
    }

    if (!Reason) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen bir susturma sebebi belirtin. Kullanıcıya özel bildirim yapılacağı için sebep boş olamaz!`
            }
        }).catch(err => { client.Error(message, "mute", err); });
        return;
    }

    if (User.id == client.user.id) {
        message.channel.send({
            embed: {
                color: `RANDOM`,
                description: `:x: Dikkat! Lütfen herhangi bir sorunum olduğunu düşünüyorsanız geliştirici ekibine bildiriniz! Botu susturamazsınız.`
            }
        }).catch(err => { client.Error(message, "mute", err); });
        return;
    }

    if (User.bot) {
        message.channel.send({
            embed: {
                color: `RANDOM`,
                description: `:x: Botlar susturulamaz!`
            }
        }).catch(err => { client.Error(message, "mute", err); });
        return;
    }

    if (User.id == message.author.id) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Kendinizi susturamazsınz.`
            }
        }).catch(err => { client.Error(message, "mute", err); });
        return;
    }

    if ((Reason.length > 512) == true) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Lütfen daha kısa bir açıklama belirtin.`
            }
        }).catch(err => { client.Error(message, "mute", err); });
        return;
    }

    const Member = message.guild.members.cache.get(User.id);

    if (Member.hasPermission("MANAGE_MESSAGES") == true) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Sunucu yetkilileri susturulamaz.`
            }
        }).catch(err => { client.Error(message, "mute", err); });
        return;
    }

    const RoleData = await muteSchema.findOne({ serverID: message.guild.id }).exec();

    try{
        if(Member.roles.cache.has(RoleData.RoleID) == true){
            message.channel.send({ embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Kullanıcı zaten susturulmuş.`
            }}).catch(err => { client.Error(message,"mute",err); });
            return;
        }else{
            Member.roles.add(RoleData.RoleID).then( role => {
            User.send(`:no_mouth: **${message.guild.name}** (\`\`${message.guild.id}\`\`) adlı sunucusuda susuturuldunuz.`).then( mute => {
                try{
                    message.guild.channels.cache.get(Data.ChannelID).send(`:no_mouth: **${User.tag}** (\`\`${User.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) tarafından susturuldu. Sebep: \`\`${Reason}\`\``);
                }catch(err){}
            message.channel.send({ embed: {
                color: `${client.config.Color.Success}`,
                description: `:white_check_mark: Kullanıcı susturuldu.`
            }}).catch(Err => { client.Error(message,"mute",Err); });
            return;
            }).catch(Err => { client.Error(message,"mute",Err); });
        }).catch(err => { client.Error(message,"mute",err); });
        }
    }catch(err){
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Susturma rolü ayarlanmamış, lütfen rolü ayarlayın!\n**Komut:** \`\`${prefix}mute-rol-ayarla @Rol\`\``
        }}).catch(err => { client.Error(message,"mute",err); });
        return;
    }

}

exports.command = {
    name: "mute",
    aliases: ["sustur"],
    category: "util",
    permission: "MANAGE_MESSAGES",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};