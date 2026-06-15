/**
 * @fileOverview Unblock a restricted user.
 */
export default {
  name: "unblock",
  category: "profile",
  description: "Remove a user from the blocked list.",
  usage: "unblock <tag/number/reply>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    if (!target || target === '@s.whatsapp.net') return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Target required.\n└────────────────");

    try {
      await ctx.sock.updateBlockStatus(target, 'unblock');
      ctx.reply(`┌──⌈ ✅ UNBLOCKED ⌋\n┃ User: @${target.split('@')[0]}\n┃ Status: Restored\n└─ 🌌 ${botName.toUpperCase()}`, { mentions: [target] });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Operation failed.\n└────────────────");
    }
  }
};
