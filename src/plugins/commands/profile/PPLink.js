/**
 * @fileOverview Extract direct URL of a profile picture.
 */
export default {
  name: "pplink",
  category: "profile",
  description: "Get the direct high-res URL of any user's profile picture.",
  usage: "pplink <tag/reply>",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    try {
      const url = await ctx.sock.profilePictureUrl(target, 'image');
      const output = `┌──⌈ 🔗 PP LINK ⌋
┃
┃ Target: @${target.split('@')[0]}
┃ Link: ${url}
┃
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output, { mentions: [target] });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Link restricted or hidden.\n└────────────────");
    }
  }
};
