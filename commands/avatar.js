exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id)
    const user = message.author || message.mentions.users.first();

    try{
        message.channel.send(user.avatarURL()).catch(err => { client.Error(message,"avatar",err); });
    }catch(err){
        client.Error(message,"avatar",err);
    }
}

exports.command = {
    name: "avatar",
    aliases: ["av","pp","pfp","profilresmi","resim"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 3500,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};