/**
 * @fileOverview Remove money from a user (Admin Only).
 */
export default {
  name: "admintake",
  aliases: ["removebal", "takemoney"],
  category: "economy",
  description: "Remove money from a user's wallet (Admin Only).",
  usage: "admintake <tag> <amount>",
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
    
    economy.wallet = Math.max(0, economy.wallet - amount);
    await ctx.bot.db.set('economy', targetId, economy);

    const output = `┌──⌈ ⚖️ ADMIN SEIZURE ⌋
┃ 
┃ Target: @${targetId}
┃ Amount: $${amount.toLocaleString()}
┃ Status: FUNDS REMOVED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
