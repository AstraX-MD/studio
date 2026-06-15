/**
 * @fileOverview Give XP to another user.
 */
export default {
  name: "transferxp",
  aliases: ["givexp", "payxp"],
  category: "rpg-levelling",
  description: "Transfer a portion of your XP to another user.",
  usage: "transferxp <tag> <amount>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag the recipient.\n└────────────────");
    if (target === ctx.sender) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ You cannot pay yourself.\n└────────────────");

    const amount = parseInt(args.find(a => /^\d+$/.test(a)));
    if (!amount || amount <= 0) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Specify a valid amount.\n└────────────────");

    const senderId = ctx.sender.split('@')[0];
    const targetId = target.split('@')[0];

    const senderStats = await ctx.bot.db.get('rpg_stats', senderId) || { xp: 0 };
    const targetStats = await ctx.bot.db.get('rpg_stats', targetId) || { xp: 0 };

    if (amount > senderStats.xp) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Insufficient XP balance.\n└────────────────");

    senderStats.xp -= amount;
    targetStats.xp += amount;

    await ctx.bot.db.set('rpg_stats', senderId, senderStats);
    await ctx.bot.db.set('rpg_stats', targetId, targetStats);

    const output = `┌──⌈ 💸 XP TRANSFER ⌋
┃ 
┃ From: @${senderId}
┃ To: @${targetId}
┃ Amount: ${amount.toLocaleString()} XP
┃ Status: COMPLETED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender, target] });
  }
};
