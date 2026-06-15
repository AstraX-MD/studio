/**
 * @fileOverview Reset a user's economy data (Admin Only).
 */
export default {
  name: "adminreset",
  aliases: ["wipebal", "reseteconomy"],
  category: "economy",
  description: "Wipe all financial data for a user (Admin Only).",
  usage: "adminreset <tag>",
  permissions: 10,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag the target to wipe.\n└────────────────");

    const targetId = target.split('@')[0];
    await ctx.bot.db.delete('economy', targetId);

    const output = `┌──⌈ ☢️ SYSTEM WIPE ⌋
┃ 
┃ Target: @${targetId}
┃ Data: ALL FINANCIALS
┃ Status: DELETED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
