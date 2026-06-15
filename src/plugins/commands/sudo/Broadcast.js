/**
 * @fileOverview Send a message to all chats.
 */
export default {
  name: "broadcast",
  aliases: ["bc"],
  category: "sudo",
  description: "Send an announcement to all connected chats.",
  usage: "!broadcast <message>",
  permissions: 9,
  execute: async (ctx, args) => {
    const text = args.join(' ');
    if (!text) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Message content missing.\n└────────────────");

    const chats = await ctx.sock.groupFetchAllParticipating();
    const jids = Object.keys(chats);

    const announcement = `┌──⌈ ANNOUNCEMENT ⌋\n┃ ${text}\n└────────────────`;

    await ctx.reply(`┌──⌈ BROADCAST ⌋\n┃ Sending to ${jids.length} chats...\n└────────────────`);

    for (const jid of jids) {
      await ctx.sock.sendMessage(jid, { text: announcement }).catch(() => {});
      await new Promise(r => setTimeout(r, 1000)); // Rate limit safety
    }

    await ctx.reply("┌──⌈ SUCCESS ⌋\n┃ Broadcast complete.\n└────────────────");
  }
};