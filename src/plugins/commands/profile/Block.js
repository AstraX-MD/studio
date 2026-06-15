/**
 * @fileOverview Block a user from interacting with the bot.
 */
export default {
  name: "block",
  category: "profile",
  description: "Block a specific user via tag, number, or reply.",
  usage: "block <tag/number/reply>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    if (!target || target === '@s.whatsapp.net') return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Target required.\n└────────────────");

    try {
      await ctx.sock.updateBlockStatus(target, 'block');
      ctx.reply(`┌──⌈ 🚫 BLOCKED ⌋\n┃ User: @${target.split('@')[0]}\n┃ Status: Restricted\n└─ 🌌 ${botName.toUpperCase()}`, { mentions: [target] });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Operation failed.\n└────────────────");
    }
  }
};
