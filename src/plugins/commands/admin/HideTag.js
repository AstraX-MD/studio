/**
 * @fileOverview Mention everyone invisibly.
 */
export default {
  name: "hidetag",
  aliases: ["htag", "invisibletag"],
  category: "admin",
  description: "Tag everyone without showing names in the message.",
  usage: "!hidetag <message>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const text = args.join(' ');
    if (!text) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Please provide a message.\n└────────────────");

    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const participants = metadata.participants.map(p => p.id);

    await ctx.sock.sendMessage(ctx.jid, { 
      text: text, 
      mentions: participants 
    });
  }
};