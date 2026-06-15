/**
 * @fileOverview Mention all group members in a status update.
 */
export default {
  name: "statusmention",
  aliases: ["statustag", "stmention"],
  category: "profile",
  description: "Mention group members in a newly posted status announcement.",
  usage: "statusmention <text>",
  permissions: 9,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const text = args.join(' ');

    if (!text) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Content missing.\n└────────────────");

    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const participants = metadata.participants.map(p => p.id);

    await ctx.sock.sendMessage('status@broadcast', {
      text: `📢 ${text}\n\n— Posted via ${botName}`,
      mentions: participants
    }, { statusJidList: participants });

    ctx.reply(`┌──⌈ 📢 STATUS TAG ⌋\n┃ Target: ${participants.length} Members\n┃ Status: Published\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
