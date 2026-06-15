/**
 * @fileOverview Toggle automatic status viewing.
 */
export default {
  name: "autoviewstatus",
  aliases: ["autostatus", "readstatus"],
  category: "automation",
  description: "Automatically view and log WhatsApp statuses.",
  usage: "autoviewstatus <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const state = args[0]?.toLowerCase() === 'on';

    await ctx.bot.db.set('automation', 'viewstatus', { enabled: state });

    const output = `┌──⌈ 👁️ STATUS VIEW ⌋
┃ 
┃ Status: ${state ? 'ACTIVE' : 'INACTIVE'}
┃ Action: Read & Log
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
