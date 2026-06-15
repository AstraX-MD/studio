/**
 * @fileOverview Fetch the 'About' info of a user.
 */
export default {
  name: "getstatus",
  aliases: ["about", "getbio"],
  category: "profile",
  description: "Get the 'About' section info for any user.",
  usage: "getstatus <tag/number/reply>",
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target;
    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
      target = ctx.sender;
    }

    try {
      const status = await ctx.sock.fetchStatus(target);
      const output = `┌──⌈ 📝 ABOUT INFO ⌋
┃
┃ Target: @${target.split('@')[0]}
┃ Content: ${status.status}
┃ Set On: ${new Date(status.setAt).toLocaleDateString()}
┃
└─ 🌌 ${botName.toUpperCase()}`;
      
      await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Information hidden by user.\n└────────────────");
    }
  }
};
