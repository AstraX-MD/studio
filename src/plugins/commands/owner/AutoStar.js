/**
 * @fileOverview Toggle the Auto-Star system for bot replies.
 */
export default {
  name: "autostar",
  aliases: ["star"],
  category: "owner",
  description: "Automatically star all messages sent by the bot.",
  usage: "autostar <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = ctx.bot.config.name || "AstraX";
    const mode = args[0]?.toLowerCase();

    if (mode === 'on' || mode === 'off') {
      const state = mode === 'on';
      await ctx.db.set('autoStar', state);
      
      const output = `┌──⌈ ⭐ AUTO-STAR ⌋
┃
┃ Status: ${state ? '✅ ENABLED' : '❌ DISABLED'}
┃ Effect: AUTO-SAVE MESSAGES
┃ Action: GLOBAL
┃
├─⊷ On: All bot msgs will be starred
├─⊷ Off: Normal messaging mode
┃
└────────────────
  © ${botName.toUpperCase()}`;
      
      return ctx.reply(output);
    }

    const current = await ctx.db.get('autoStar');
    ctx.reply(`┌──⌈ ⚙️ CONFIG ⌋\n┃\n┃ Auto-Star: ${current ? 'ON' : 'OFF'}\n┃ Usage: !autostar on\n└────────────────`);
  }
};