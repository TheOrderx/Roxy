const { table } = require("table");

exports.run = async (client, message, args) => {
    const member = args[0] || message.author.id
    const Schema = require('../models/Warnings');
    let config, data, output

    if(isNaN(member)){ member = message.author.id; }
    data = [["ID","User ID","Username","Moderator","Reason"]];
    config = {
        singleLine: true,
        border: {
         topBody: `─`,
         topJoin: `┬`,
         topLeft: `┌`,
         topRight: `┐`,

         bottomBody: `─`,
         bottomLeft: `└`,
         bottomRight: `┘`,

         bodyLeft: `│`,
         bodyRight: `│`,
         bodyJoin: `│`,

         joinBody: `─`,
         joinLeft: `├`,
        }
    };

    function getReason(Reason){ if((Reason.length > 35) == true ){ return Reason.substr(0,35)+"..."; }else{ return Reason; } }

    Schema.find({ serverID: message.guild.id, userID: member, Active: true }).then( Database => {
        Database.forEach( Data => {
            data.push([Data.ID,Data.userID,message.guild.members.cache.get(Data.userID).user.tag,message.guild.members.cache.get(Data.moderatorID).user.tag,getReason(Data.Reason)]);
        });
        output = table(data, config);
        message.channel.send(`\`\`\`${output.substr(0,1992)}\`\`\``);
    });
}

exports.command = {
    name: "uyarılar",
    aliases: ["uyarı-listele"],
    category: "util",
    permission: "MANAGE_MESSAGES",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};