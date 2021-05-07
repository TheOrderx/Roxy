exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require('../models/Warnings');
    const ModSchema = require('../models/ModerationLogs');
    const WarnSchema = require('../models/Warn');
    const Data = await ModSchema.findOne({ serverID: message.guild.id }).exec();
    const User = message.mentions.users.first();
    const Reason = args.slice(1).join(" ");
    const ID = await client.randomStr(6, "#");

    if (!User) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen uyarılacak kullancıyı etiketleyerek tekrar deneyin.`
            }
        }).catch(err => { client.Error(message, "warn", err); });
        return;
    }

    if (!Reason) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen bir uyarı sebebi belirtin. Kullanıcıya özel bildirim yapılacağı için uyarı sebebi boş olamaz!`
            }
        }).catch(err => { client.Error(message, "warn", err); });
        return;
    }

    if (User.id == client.user.id) {
        message.channel.send({
            embed: {
                color: `RANDOM`,
                description: `:x: Dikkat! Lütfen herhangi bir sorunum olduğunu düşünüyorsanız geliştirici ekibine bildiriniz! Botu uyaramazsınız.`
            }
        }).catch(err => { client.Error(message, "warn", err); });
        return;
    }

    if (User.bot) {
        message.channel.send({
            embed: {
                color: `RANDOM`,
                description: `:x: Botlar uyarılamaz!`
            }
        }).catch(err => { client.Error(message, "warn", err); });
        return;
    }

    if (User.id == message.author.id) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Kendinizi uyaramazsınız.`
            }
        }).catch(err => { client.Error(message, "warn", err); });
        return;
    }

    if ((Reason.length > 512) == true) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Lütfen daha kısa bir açıklama belirtin.`
            }
        }).catch(err => { client.Error(message, "warn", err); });
        return;
    }

    const Member = message.guild.members.cache.get(User.id);

    if (Member.hasPermission("MANAGE_MESSAGES") == true) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Sunucu yetkilileri uyarılamaz.`
            }
        }).catch(err => { client.Error(message, "warn", err); });
        return;
    }

    try{
        const Data = await WarnSchema.findOne({ serverID: message.guild.id }).exec();
        message.guild.members.cache.get(User.id).roles.add(Data.RoleID).then( warn => {
            User.send(`:warning: **${message.guild.name}** (\`\`${message.guild.id}\`\`) adlı sunucuda şu sebeple uyarıldınız!\`\`\`${Reason}\`\`\``).then(async WarnMsg => {
        const obj = {
            ID: ID,
            serverID: message.guild.id,
            userID: Member.id,
            moderatorID: message.author.id,
            Reason: Reason,
            Date: new Date(),
            Active: true
        }
        const push = new Schema(obj);
        push.save(async (err, doc) => {
            if (err) {
                return err;
            }

            if (doc) {
                try {
                    message.guild.channels.cache.get(Data.ChannelID).send(`:warning: **${Member.user.tag}** (\`\`${Member.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) tarafından uyarıldı. Sebep: \`\`${Reason}\`\``);
                } catch (err) { }
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:ok_hand: Kullanıcı uyarıldı.`
                    }
                }).catch(err => { client.Error(message, "warn", err); });
                return;
            }
        });
    }).catch(async err => {
        const obj = {
            ID: ID,
            serverID: message.guild.id,
            userID: Member.id,
            moderatorID: message.author.id,
            Reason: Reason,
            Date: new Date(),
            Active: true
        }
        const push = new Schema(obj);
        push.save(async (err, doc) => {
            if (err) {
                return err;
            }

            if (doc) {
                try {
                    message.guild.channels.cache.get(Data.ChannelID).send(`:warning: **${Member.user.tag}** (\`\`${Member.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) tarafından uyarıldı. Sebep: \`\`${Reason}\`\``);
                } catch (err) { }
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:ok_hand: Kullanıcı uyarıldı. _Kullanıcı özel mesaj ile bilgilendirilemedi_`
                    }
                }).catch(err => { client.Error(message, "warn", err); });
                return;
            }
        });
    });
        }).catch(err => { 
        User.send(`:warning: **${message.guild.name}** (\`\`${message.guild.id}\`\`) adlı sunucuda şu sebeple uyarıldınız!\`\`\`${Reason}\`\`\``).then(async WarnMsg => {
        const obj = {
            ID: ID,
            serverID: message.guild.id,
            userID: Member.id,
            moderatorID: message.author.id,
            Reason: Reason,
            Date: new Date(),
            Active: true
        }
        const push = new Schema(obj);
        push.save(async (err, doc) => {
            if (err) {
                return err;
            }

            if (doc) {
                try {
                    message.guild.channels.cache.get(Data.ChannelID).send(`:warning: **${Member.user.tag}** (\`\`${Member.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) tarafından uyarıldı. Sebep: \`\`${Reason}\`\``);
                } catch (err) { }
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:ok_hand: Kullanıcı uyarıldı. _Uyarı rolü verilemedi_`
                    }
                }).catch(err => { client.Error(message, "warn", err); });
                return;
            }
        });
    }).catch(async err => {
        const obj = {
            ID: ID,
            serverID: message.guild.id,
            userID: Member.id,
            moderatorID: message.author.id,
            Reason: Reason,
            Date: new Date(),
            Active: true
        }
        const push = new Schema(obj);
        push.save(async (err, doc) => {
            if (err) {
                return err;
            }

            if (doc) {
                try {
                    message.guild.channels.cache.get(Data.ChannelID).send(`:warning: **${Member.user.tag}** (\`\`${Member.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) tarafından uyarıldı. Sebep: \`\`${Reason}\`\``);
                } catch (err) { }
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:ok_hand: Kullanıcı uyarıldı. _Kullanıcı özel mesaj ile bilgilendirilemedi_ - _Uyarı rolü verilemedi._`
                    }
                }).catch(err => { client.Error(message, "warn", err); });
                return;
            }
        });
    });
});
    }catch(err){
        User.send(`:warning: **${message.guild.name}** (\`\`${message.guild.id}\`\`) adlı sunucuda şu sebeple uyarıldınız!\`\`\`${Reason}\`\`\``).then(async WarnMsg => {
        const obj = {
            ID: ID,
            serverID: message.guild.id,
            userID: Member.id,
            moderatorID: message.author.id,
            Reason: Reason,
            Date: new Date(),
            Active: true
        }
        const push = new Schema(obj);
        push.save(async (err, doc) => {
            if (err) {
                return err;
            }

            if (doc) {
                try {
                    message.guild.channels.cache.get(Data.ChannelID).send(`:warning: **${Member.user.tag}** (\`\`${Member.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) tarafından uyarıldı. Sebep: \`\`${Reason}\`\``);
                } catch (err) { }
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:ok_hand: Kullanıcı uyarıldı. _Uyarı rolü verilemedi_`
                    }
                }).catch(err => { client.Error(message, "warn", err); });
                return;
            }
        });
    }).catch(async err => {
        const obj = {
            ID: ID,
            serverID: message.guild.id,
            userID: Member.id,
            moderatorID: message.author.id,
            Reason: Reason,
            Date: new Date(),
            Active: true
        }
        const push = new Schema(obj);
        push.save(async (err, doc) => {
            if (err) {
                return err;
            }

            if (doc) {
                try {
                    message.guild.channels.cache.get(Data.ChannelID).send(`:warning: **${Member.user.tag}** (\`\`${Member.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) tarafından uyarıldı. Sebep: \`\`${Reason}\`\``);
                } catch (err) { }
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:ok_hand: Kullanıcı uyarıldı. _Kullanıcı özel mesaj ile bilgilendirilemedi_ - _Uyarı rolü verilemedi._`
                    }
                }).catch(err => { client.Error(message, "warn", err); });
                return;
            }
        });
    });
    }
}

exports.command = {
    name: "uyarı",
    aliases: ["warn", "uyarı-ekle", "uyar"],
    category: "util",
    permission: "MANAGE_MESSAGES",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};