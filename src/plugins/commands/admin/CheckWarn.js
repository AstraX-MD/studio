/**
 * @fileOverview Check user warnings.
 */
export default {
  name: "warnings",
  aliases: ["checkwarn"],
  category: "admin",
  description: "Check how many warnings a member has accumulated.",
  usage: "!warnings <tag/reply>",
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

    const output = `┌──⌈ WARN STATUS ⌋
┃ Target: @${target.split('@')[0]}
┃ Warnings: ${count}/3
┃ Status: ${count >= 2 ? 'Critical' : 'Safe'}
└────────────────`;
    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};