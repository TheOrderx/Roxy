exports.run = async (client, message, args) => {
    const clean = text => {
        if (typeof (text) === "string")
          return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
          return text;
      }
    
      try {
        const code = args.join(" "),
          msg = message;
    
          const a =code.replace("--silent","");
          const b =a.replace("--split","");
    
        let evaled = await eval(b);
    
        if (typeof evaled !== "string") evaled = await require("util").inspect(evaled);
        if (evaled.includes(client.token)) return message.channel.send("```JS\n **********```");
    
        if (code.includes("--silent")) {
          message.react("✅")
        } else if (code.includes("--split")) {
          if(message.author.id != "432476132609228800" ) return  message.channel.send("```JS\n" + clean(evaled) + " ```").catch(err => { message.react(client.emojiid.warn)});
          message.channel.send("```JS\n" + clean(evaled) + " ```", { split: true })
        } else {
          message.channel.send("```JS\n" + clean(evaled) + " ```").catch(err => message.channel.send("```" + err.message + "```"));
        }
      } catch (err) {
        message.channel.send(`\`HATA\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
}

exports.command = {
    name: "eval",
    aliases: ["ev"],
    category: "administrator",
    permission: "BOT_OWNER",
    cooldown: 1000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};