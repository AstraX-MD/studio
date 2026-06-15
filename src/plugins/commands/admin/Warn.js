/**
 * @fileOverview Give warning to member.
 */
export default {
  name: "warn",
  aliases: ["givewarn"],
  category: "admin",
  description: "Issue a formal warning to a member.",
  usage: "!warn <tag/reply>",
  permissions: 4, // MODERATOR+
  groupOnly: true,
  execute: async (ctx) => {
    let target;
    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (!target) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Target required.\n└────────────────");

    const userId = target.split('@')[0];
    const key = `warns:${ctx.jid}:${userId}`;
    const current = (await ctx.bot.db.get('group_warns', key)) || 0;
    const count = current + 1;
    
    await ctx.bot.db.set('group_warns', key, count);

    const output = `┌──⌈ WARNING ⌋
┃ Target: @${userId}
┃ Count: ${count}/3
┃ Action: Logged
┃ Status: Active
└────────────────`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });

    if (count >= 3) {
      await ctx.reply(`┌──⌈ PROTOCOL ⌋\n┃ Target exceeded limit.\n┃ Action: Kicking member...\n└────────────────`);
      await ctx.sock.groupParticipantsUpdate(ctx.jid, [target], "remove").catch(() => {});
      await ctx.bot.db.delete('group_warns', key);
    }
  }
};