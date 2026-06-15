/**
 * @fileOverview Toggle disappearing messages.
 */
export default {
  name: "ephemeral",
  aliases: ["disappearing", "setexpiry"],
  category: "admin",
  description: "Enable or disable disappearing messages.",
  usage: "!ephemeral <on/off/seconds>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    let duration = 0;
    if (args[0] === 'on') duration = 604800; // 7 days
    else if (args[0] === 'off') duration = 0;
    else duration = parseInt(args[0]) || 0;

    try {
      await ctx.sock.sendMessage(ctx.jid, { disappearingMessagesInChat: duration });
      ctx.reply(`┌──⌈ EPHEMERAL ⌋\n┃ Status: ${duration > 0 ? 'Active' : 'Disabled'}\n┃ Duration: ${duration}s\n└────────────────`);
    } catch (e) {
      ctx.reply("┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────");
    }
  }
};