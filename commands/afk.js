exports.run = async (client, message, args) => {
    if (client.Afk.get(message.author.id)) {
        console.log("afk kullanıcı")
        return;
    }
    const Reason = args.slice(0).join(" ") || "Herhangi bir sebep.";
    const AfkModel = require('../models/Afk');
    const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    if (regex.test(Reason)) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Afk sebeplerine link koyamazsınız.`
            }
        }).catch(err => { return client.Error(message,"afk",err); });
        return;
    }
    if ((Reason.length > 500) == true) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen 500 karakterden daha az bir afk açıklaması giriniz.`
            }
        }).catch(err => { return client.Error(message,"afk",err); });
        return;
    }
    const obj = { userID: message.author.id, Reason: Reason }
    const push = new AfkModel(obj);
    push.save((err, doc) => {
        if (!err) {
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Success}`,
                    description: `:white_check_mark: Artık **${doc.Reason}** sebebi ile afk modundasın.`
                }
            }).then(msg => {
                client.Afk.set(message.author.id, Reason);
            }).catch(err => { return client.Error(message,"afk:database",err); });
        }
    })
}

exports.command = {
    name: "afk",
    aliases: ["awayfromkeyboard"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};