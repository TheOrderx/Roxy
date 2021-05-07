exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id)
    const Schema = require('../models/Tag');
    const StringData = args.slice(1).join(" ");

    if(args[0] == "tag-ayarla"){

        if(!message.member.hasPermission("MANAGE_GUILD")){
            message.channel.send({ embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen bir tag belirtin. Silmek istiyorsanız \`\`kaldır\`\` yazabilirsiniz.`,
                fields: [
                {
                    name: `Ayarlama Komutu Örnek:`,
                    value: `${prefix}tag tag-ayarla BurayaTag`
                },
                {
                    name: `Silme Komutu:`,
                    value: `${prefix}tag kaldır`
                },
                {
                    name: "Rol ayarlama komutu:",
                    value: `${prefix}tag rol-ayarla @Rol`
                }
                ]
            }}).catch(err => { client.Error(message,"tag:ayarla",err); });
            return;
        }

        if(args[0] == "rol-ayarla"){
            const Rol = message.mentions.roles.first();
            
            if(!Rol){
                message.channel.send("lütfen bir rol etiketlerek tekrar deneyin.");
                return;
            }

            try{
                const Data = await Schema.findOne({ serverID: message.guild.id }).exec();
                Data.RoleID = Rol.id
                Data.save((err,doc) => {
                    if(err){
                        client.Error(message,"tag",err);
                        return;
                    }

                    if(doc){
                        message.channel.send({ embed: {
                            color: `${client.config.Color.Success}`,
                            description: `:white_check_mark: Başarılı! Kalıcı adında tag bulunduran kullanıcılara rol verilecek.`
                        }}).catch(err => { client.Error(message,"tag",err); });

                    }
                })
            }catch(err){
                message.channel.send({ embed: {
                    color: `RANDOM`,
                    description: `:warning: Lütfen tag ayarlamasım yapınız.`
                }})
            }
        }

        if(args[0] == "kaldır"){
            await Schema.findOneAndDelete({ serverID: message.guild.id }).exec();
            message.channel.send({ embed: {
                color: `${client.config.Color.Success}`,
                description: `:white_check_mark: Kaldırma işlemi başarılı.`,
                fields: [
                {
                    name: `Ayarlama Komutu Örnek:`,
                    value: `${prefix}tag tag-ayarla BurayaTag`
                }
                ]
            }}).catch(err => { client.Error(message,"tag:ayarla",err); });
            return;
        }

        if(!StringData){
            message.channel.send({ embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen bir tag belirtin.`,
                fields: [
                {
                    name: `Ayarlama Komutu Örnek:`,
                    value: `${prefix}tag tag-ayarla BurayaTag`
                }
                ]
            }}).catch(err => { client.Error(message,"tag:ayarla",err); });
            return;
        }

        try{
            const Data = await Schema.findOne({ serverID: message.guild.id }).exec();
            Data.Tag = StringData
            Data.save((err,doc) => {
                if(!err){
                    message.channel.send({ embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:white_check_mark: Yeni tag başarı ile ayarlandı.`
                    }}).catch(err => { client.Error(message,"tag:ayarla",err); });
                    return;
                }

                if(err){
                    client.Error(message,"tag:ayarla",err);
                    return;
                }
            });
        }catch(err){
            const obj = { serverID: message.guild.id, Tag: StringData };
            const push = new Schema(obj);
            push.save((err,doc) => {
                if(!err){
                    message.channel.send({ embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:white_check_mark: Yeni tag başarı ile ayarlandı.`
                    }}).catch(err => { client.Error(message,"tag:ayarla",err); });
                    return;
                }

                if(err){
                    client.Error(message,"tag:ayarla",err);
                    return;
                }
            });
        }
        return;
    }

    try{
        const Data = await Schema.findOne({ serverID: message.guild.id }).exec();
        message.channel.send({ embed: {
            color: `RANDOM`,
            description: `${Data.Tag}`
        }});
    }catch(err){
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `Sunucu tagı ayarlanmamış.`,
            fields: [{
                name: "Komut:",
                value: `${prefix}tag tag-ayarla TagBuraya`
            }]
        }}).catch(err => { client.Error(message,"tag",err); });
    }
}

exports.command = {
    name: "tag",
    aliases: ["tags"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 3500,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};