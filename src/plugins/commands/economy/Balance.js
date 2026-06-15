/**
 * @fileOverview Check wallet and bank balance.
 */
export default {
  name: "balance",
  aliases: ["bal", "wallet", "bank"],
  category: "economy",
  description: "Check your current cash and bank balance.",
  usage: "balance [tag]",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const userId = target.split('@')[0];
    const data = await ctx.bot.db.get('economy', userId) || { wallet: 0, bank: 0 };

    const output = `┌──⌈ 💰 FINANCIALS ⌋
┃ Target: @${userId}
┃ 
├─ Wallet: $${data.wallet.toLocaleString()}
├─ Bank: $${data.bank.toLocaleString()}
├─ Net Worth: $${(data.wallet + data.bank).toLocaleString()}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
