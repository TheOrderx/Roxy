module.exports = async (client, member) => {
    const HgBbSchema = require('../models/HgBb');
    const ServerRegisterSchema = require('../models/ServerRegister');
    const AutoRole = require('../models/AutoRole');
    const TagSchema = require('../models/Tag');
    const InviteLog = require('../models/ServerInvite');

    try {
        const HgBbData = await HgBbSchema.findOne({ serverID: member.guild.id }).exec();
        const String = HgBbData.HGContent.replace("{user.etiket}", member).replace("{user.name}", member.user.tag);
        member.guild.channels.cache.get(HgBbData.ChannelID).send(String);
    } catch (err) { }

    try {
        const ServerRegisterData = await ServerRegisterSchema.findOne({ serverID: member.guild.id }).exec();
        const String = ServerRegisterData.JoinMessage.replace("{user.etiket}", `<@${member.id}>`).replace("{user.name}", `${member.user.tag}`)
            .replace("{yetkili.etiket}", `<@&${ServerRegisterData.RegisterStaff}>`).replace(`{yetkili.name}`, `${member.guild.roles.cache.get(ServerRegisterData.RegisterStaff).name}`)
        member.guild.channels.cache.get(ServerRegisterData.RegisterChannel).send(String).catch(err => { console.log(err); });
        member.roles.add(ServerRegisterData.UnregisteredRoleID).catch(err => { console.log(err); });
        member.guild.channels.cache.get(ServerRegisterData.LogChannel).send(`🟡 **${member.user.tag}** (\`\`${member.id}\`\`) adlı kullanıcı sunucuya giriş yaptı, kayıt için yetkili bekleniyor.`);
    } catch (err) { }

    try {
        const Data = ServerGuard.findOne({ serverID: member.guild.id }).exec();
        if (Data.Bot == true) {
            if (member.bot == true) {
                member.guild.members.ban(member.id).catch(err => { return; });
                member.guild.members.cache.get(member.guild.owner.id).send(`**Dikkat** Sunucunuza bot eklendi ve bot koruması ile sunucudan atıldı.`).catch(err => { return; });
            }
        }
    } catch (err) { }

    try {
        const Data = await AutoRole.findOne({ serverID: member.guild.id }).exec();
        member.guild.members.cache.get(member.id).roles.add(Data.RoleID).then(Role => {
            member.guild.channels.cache.get(Data.ChannelID).send(`:white_check_mark: **${member.user.tag}** adlı kullanıcı sunucuya giriş yaptı. **${member.guild.roles.cache.get(Data.RoleID).name}** rolü verildi.`);
        });
    } catch (err) { }

    try {
        const Data = await TagSchema.findOne({ serverID: member.guild.id }).exec();
        member.setNickname(`${Data.Tag} ${member.user.username}`);
    } catch (err) { }

    try {
        member.guild.fetchInvites().then( async guildInvites => {
            const ei = client.invites[member.guild.id];
            client.invites[member.guild.id] = guildInvites;
            const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
            const inviter = client.users.cache.get(invite.inviter.id);


            const Data = await InviteLog.findOne({ serverID: member.guild.id }).exec();
            const replace = Data.JoinMessage.replace("{user.etiket}", `<@${inviter.id}>`).replace("{member.size}", member.guild.memberCount).replace("{davet.kod}", invite.code).replace("{davet.uye}", invite.uses)
            member.guild.channels.cache.get(Data.ChannelID).send(`${replace}`);
        });
    } catch (err) { }

}