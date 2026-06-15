/**
 * @fileOverview Add a user to the group.
 */
export default {
  name: "add",
  category: "admin",
  description: "Add a user to the group via phone number.",
  usage: "add <number>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const number = args[0]?.replace(/[^0-9]/g, '');
    if (!number) return ctx.reply(`┌──⌈ ERROR ⌋\n┃ Use: ${prefix}add 254... \n└────────────────`);

    try {
      const jid = number + '@s.whatsapp.net';
      await ctx.sock.groupParticipantsUpdate(ctx.jid, [jid], "add");
      ctx.reply(`┌──⌈ ➕ ADD ⌋\n┃ Target: @${number}\n┃ Status: Added Successfully\n└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ERROR ⌋\n┃ Failed to add. Check privacy settings.\n└────────────────`);
    }
  }
};