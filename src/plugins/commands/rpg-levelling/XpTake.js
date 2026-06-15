/**
 * @fileOverview Admin command to remove XP from a user.
 */
export default {
  name: "xptake",
  aliases: ["remxp"],
  category: "rpg-levelling",
  description: "Remove a specific amount of XP from a user (Admin Only).",
  usage: "xptake <tag> <amount>",
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
    
    stats.xp = Math.max(0, stats.xp - amount);
    await ctx.bot.db.set('rpg_stats', userId, stats);

    const output = `┌──⌈ 📉 XP DRAIN ⌋
┃ 
┃ Target: @${userId}
┃ Amount: -${amount.toLocaleString()} XP
┃ Status: ENFORCED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
