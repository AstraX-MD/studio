/**
 * @fileOverview Admin command to grant XP to a user.
 */
export default {
  name: "xpgive",
  aliases: ["addxp"],
  category: "rpg-levelling",
  description: "Grant a specific amount of XP to a user (Admin Only).",
  usage: "xpgive <tag> <amount>",
  permissions: 8,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Please tag the target user.\n└────────────────");

    const amount = parseInt(args.find(a => /^\d+$/.test(a)));
    if (!amount || amount <= 0) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Specify a valid XP amount.\n└────────────────");

    const userId = target.split('@')[0];
    const stats = await ctx.bot.db.get('rpg_stats', userId) || { xp: 0, level: 0 };
    
    stats.xp += amount;
    await ctx.bot.db.set('rpg_stats', userId, stats);

    const output = `┌──⌈ ✨ XP INJECTION ⌋
┃ 
┃ Target: @${userId}
┃ Amount: +${amount.toLocaleString()} XP
┃ Status: AUTHORIZED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
