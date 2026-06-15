/**
 * @fileOverview Toggle automatic read receipts (Blue Ticks).
 */
export default {
  name: "autoread",
  aliases: ["read", "bluetick"],
  category: "automation",
  description: "Automatically mark messages as read.",
  usage: "autoread <on/off> [all/dm/groups]",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const state = args[0]?.toLowerCase() === 'on';
    const target = args[1]?.toLowerCase() || 'all';

    await ctx.bot.db.set('automation', `read:${target}`, { enabled: state });

    const output = `┌──⌈ ✅ AUTO-READ ⌋
┃ 
┃ Status: ${state ? 'ENABLED' : 'DISABLED'}
┃ Target: ${target}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
