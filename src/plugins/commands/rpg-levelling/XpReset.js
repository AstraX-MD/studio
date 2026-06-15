/**
 * @fileOverview Admin command to reset a user's RPG progress.
 */
export default {
  name: "xpreset",
  category: "rpg-levelling",
  description: "Wipe all RPG progress for a user (Admin Only).",
  usage: "xpreset <tag>",
  permissions: 9,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Target required for progress wipe.\n└────────────────");

    const userId = target.split('@')[0];
    await ctx.bot.db.delete('rpg_stats', userId);

    const output = `┌──⌈ ☢️ RPG WIPE ⌋
┃ 
┃ Target: @${userId}
┃ Action: Progress Reset
┃ Status: DATA PURGED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
