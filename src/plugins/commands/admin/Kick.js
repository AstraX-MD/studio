/**
 * @fileOverview Remove a member from the group.
 */
export default {
  name: "kick",
  aliases: ["remove", "rk"],
  category: "admin",
  description: "Remove a member from the group chat.",
  usage: "kick <tag/reply/number>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    let target;

    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }

    if (!target) return ctx.reply(`┌──⌈ ERROR ⌋\n┃ Use: ${prefix}kick @tag\n└────────────────`);

    try {
      await ctx.sock.groupParticipantsUpdate(ctx.jid, [target], "remove");
      const output = `┌──⌈ 🚫 KICK ⌋
┃ Target: @${target.split('@')[0]}
┃ Action: Removed
┃ Status: Success
└────────────────`;
      await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
    } catch (e) {
      ctx.reply(`┌──⌈ ERROR ⌋\n┃ Execution failed. Check permissions.\n└────────────────`);
    }
  }
};