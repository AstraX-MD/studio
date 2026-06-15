/**
 * @fileOverview Fetch the profile picture of a user.
 */
export default {
  name: "getpp",
  aliases: ["pp", "getavatar"],
  category: "profile",
  description: "Retrieve the profile picture of a user via tag, number, or reply.",
  usage: "getpp <tag/number/reply>",
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
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
      const url = await ctx.sock.profilePictureUrl(target, 'image');
      const output = `┌──⌈ 📸 PROFILE PIC ⌋
┃
┃ Target: @${target.split('@')[0]}
┃ Status: Retrieved
┃ Origin: Global Server
┃
├─⊷ ${prefix}pplink
│  └⊷ Get direct URL
└────────────────
  © ${botName.toUpperCase()}`;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url }, 
        caption: output,
        mentions: [target]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ No profile picture found or\n┃ privacy settings restricted.\n└────────────────`);
    }
  }
};
