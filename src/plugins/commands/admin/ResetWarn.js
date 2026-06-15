/**
 * @fileOverview Clear warnings.
 */
export default {
  name: "resetwarn",
  aliases: ["clearwarn"],
  category: "admin",
  description: "Reset the warning counter for a member.",
  usage: "!resetwarn <tag/reply>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    let target;
    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (!target) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Target required.\n└────────────────");

    const key = `warns:${ctx.jid}:${target.split('@')[0]}`;
    await ctx.bot.db.delete('group_warns', key);

    ctx.reply(`┌──⌈ WARNINGS ⌋\n┃ Target: @${target.split('@')[0]}\n┃ Action: Reset\n┃ Status: Clean\n└────────────────`);
  }
};