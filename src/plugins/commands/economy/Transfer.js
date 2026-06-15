/**
 * @fileOverview Send money to another user.
 */
export default {
  name: "transfer",
  aliases: ["give", "pay"],
  category: "economy",
  description: "Transfer money to another user.",
  usage: "transfer <tag> <amount>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag the recipient.\n└────────────────");
    if (target === ctx.sender) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ You can't pay yourself.\n└────────────────");

    const amount = parseInt(args.find(a => /^\d+$/.test(a)));
    if (!amount || amount <= 0) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Specify a valid amount.\n└────────────────");

    const senderId = ctx.sender.split('@')[0];
    const targetId = target.split('@')[0];

    const senderEco = await ctx.bot.db.get('economy', senderId) || { wallet: 0, bank: 0 };
    const targetEco = await ctx.bot.db.get('economy', targetId) || { wallet: 0, bank: 0 };

    if (amount > senderEco.wallet) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ You don't have enough cash.\n└────────────────");

    senderEco.wallet -= amount;
    targetEco.wallet += amount;

    await ctx.bot.db.set('economy', senderId, senderEco);
    await ctx.bot.db.set('economy', targetId, targetEco);

    const output = `┌──⌈ 💸 TRANSFER ⌋
┃ 
┃ From: @${senderId}
┃ To: @${targetId}
┃ Amount: $${amount.toLocaleString()}
┃ Status: SUCCESSFUL
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender, target] });
  }
};
