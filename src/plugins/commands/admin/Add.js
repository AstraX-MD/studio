/**
 * @fileOverview Add member.
 */
export default {
  name: "add",
  aliases: ["inviteuser"],
  category: "admin",
  description: "Add a user to the group via their phone number.",
  usage: "!add <number>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const number = args[0]?.replace(/[^0-9]/g, '');
    if (!number) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Provide phone number.\n└────────────────");

    try {
      const jid = number + '@s.whatsapp.net';
      await ctx.sock.groupParticipantsUpdate(ctx.jid, [jid], "add");
      ctx.reply(`┌──⌈ ADD ⌋\n┃ Target: @${number}\n┃ Action: Member Added\n└────────────────`);
    } catch (e) {
      ctx.reply("┌──⌈ ERROR ⌋\n┃ Failed to add. Check privacy settings.\n└────────────────");
    }
  }
};