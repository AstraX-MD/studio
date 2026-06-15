/**
 * @fileOverview Enhanced PP Viewer.
 */
export default {
  name: "ppview",
  category: "profile",
  description: "View a high-definition version of a profile picture.",
  usage: "ppview <tag>",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    try {
      const url = await ctx.sock.profilePictureUrl(target, 'image');
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url }, 
        caption: `┌──⌈ 🔍 HD VIEWER ⌋\n┃ User: @${target.split('@')[0]}\n└─ 🌌 ${botName.toUpperCase()}`,
        mentions: [target]
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ HD view unavailable.\n└────────────────");
    }
  }
};
