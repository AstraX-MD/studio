/**
 * @fileOverview Issue warnings to users with automated actions.
 */
export default {
  name: "warn",
  category: "admin",
  description: "Issue a formal warning to a member.",
  usage: "warn <tag/reply>",
  permissions: 4,
  groupOnly: true,
  execute: async (ctx) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    let target;
    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (!target) return ctx.reply(`┌──⌈ ERROR ⌋\n┃ Tag/Reply to user.\n└────────────────`);

    const userId = target.split('@')[0];
    const key = `warns:${ctx.jid}:${userId}`;
    const current = (await ctx.bot.db.get('group_warns', key)) || 0;
    const count = current + 1;
    
    await ctx.bot.db.set('group_warns', key, count);

    const output = `┌──⌈ ⚠️ WARNING ⌋
┃ Target: @${userId}
┃ Count: ${count}/3
┃ Status: Logged
└────────────────`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });

    if (count >= 3) {
      await ctx.reply(`┌──⌈ AUTO ACTION ⌋\n┃ Threshold exceeded.\n┃ Action: Kicking member...\n└────────────────`);
      await ctx.sock.groupParticipantsUpdate(ctx.jid, [target], "remove").catch(() => {});
      await ctx.bot.db.delete('group_warns', key);
    }
  }
};