/**
 * @fileOverview Add money to a user (Admin Only).
 */
export default {
  name: "admingive",
  aliases: ["addbal", "givemoney"],
  category: "economy",
  description: "Add money to a user's wallet (Admin Only).",
  usage: "admingive <tag> <amount>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag the target.\n└────────────────");

    const amount = parseInt(args.find(a => /^\d+$/.test(a)));
    if (!amount || amount <= 0) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Specify a valid amount.\n└────────────────");

    const targetId = target.split('@')[0];
    const economy = await ctx.bot.db.get('economy', targetId) || { wallet: 0, bank: 0 };
    
    economy.wallet += amount;
    await ctx.bot.db.set('economy', targetId, economy);

    const output = `┌──⌈ 💎 ADMIN GRANT ⌋
┃ 
┃ Target: @${targetId}
┃ Amount: $${amount.toLocaleString()}
┃ Status: FUNDS INJECTED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
