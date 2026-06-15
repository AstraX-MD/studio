/**
 * @fileOverview Toggle disappearing messages.
 */
export default {
  name: "ephemeral",
  category: "admin",
  description: "Set disappearing messages duration.",
  usage: "ephemeral <on/off/seconds>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    let duration = 0;
    if (args[0] === 'on') duration = 604800;
    else if (args[0] === 'off') duration = 0;
    else duration = parseInt(args[0]) || 0;

    try {
      await ctx.sock.sendMessage(ctx.jid, { disappearingMessagesInChat: duration });
      ctx.reply(`┌──⌈ 🕒 EPHEMERAL ⌋
┃ Status: ${duration > 0 ? 'Active' : 'Disabled'}
┃ Timer: ${duration}s
└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────`);
    }
  }
};