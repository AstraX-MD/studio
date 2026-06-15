/**
 * @fileOverview Check warning status.
 */
export default {
  name: "warnings",
  category: "admin",
  description: "View warning count for a member.",
  usage: "warnings <tag/reply>",
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    let target;
    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
      target = ctx.sender;
    }

    const key = `warns:${ctx.jid}:${target.split('@')[0]}`;
    const count = (await ctx.bot.db.get('group_warns', key)) || 0;

    const output = `┌──⌈ 📜 WARN LOG ⌋
┃ Target: @${target.split('@')[0]}
┃ Total Warns: ${count}/3
┃ Risk: ${count >= 2 ? 'High' : 'Low'}
└────────────────`;
    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};