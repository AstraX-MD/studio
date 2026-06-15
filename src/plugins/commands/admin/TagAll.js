/**
 * @fileOverview Mention all group members.
 */
export default {
  name: "tagall",
  aliases: ["everyone", "all"],
  category: "admin",
  description: "Mention all members in the group.",
  usage: "!tagall [message]",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const participants = metadata.participants.map(p => p.id);
    const message = args.join(' ') || "No message provided.";

    let output = `┌──⌈ TAG ALL ⌋\n┃ Message: ${message}\n┃ Members: ${participants.length}\n└────────────────\n\n`;
    participants.forEach((id, i) => {
      output += `┃ ${i + 1}. @${id.split('@')[0]}\n`;
    });
    output += `└────────────────`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: participants });
  }
};