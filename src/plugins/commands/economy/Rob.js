/**
 * @fileOverview Steal money from others with high risk.
 */
export default {
  name: "rob",
  category: "economy",
  description: "Attempt to steal money from another user's wallet.",
  usage: "rob <tag>",
  cooldown: 30,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Tag your victim.\n└────────────────");
    if (target === ctx.sender) return ctx.reply("┌──⌈ 😂 ERROR ⌋\n┃ You robbed yourself. Idiot.\n└────────────────");

    const senderId = ctx.sender.split('@')[0];
    const targetId = target.split('@')[0];

    const senderEco = await ctx.bot.db.get('economy', senderId) || { wallet: 0, bank: 0 };
    const targetEco = await ctx.bot.db.get('economy', targetId) || { wallet: 0, bank: 0 };

    if (targetEco.wallet < 1000) return ctx.reply("┌──⌈ 🚫 CRIME ⌋\n┃ They are too poor to rob.\n└────────────────");

    const success = Math.random() > 0.6;
    if (success) {
      const stolen = Math.floor(Math.random() * (targetEco.wallet / 2)) + 100;
      senderEco.wallet += stolen;
      targetEco.wallet -= stolen;
      await ctx.bot.db.set('economy', senderId, senderEco);
      await ctx.bot.db.set('economy', targetId, targetEco);
      
      const output = `┌──⌈ 🔫 HEIST SUCCESS ⌋\n┃ \n┃ You stole $${stolen.toLocaleString()}!\n┃ Status: WANTED\n└─ 🌌 ${botName.toUpperCase()}`;
      await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
    } else {
      const fine = 2000;
      senderEco.wallet = Math.max(0, senderEco.wallet - fine);
      await ctx.bot.db.set('economy', senderId, senderEco);
      
      const output = `┌──⌈ 🚔 BUSTED ⌋\n┃ \n┃ You were caught! \n┃ Paid Fine: $${fine.toLocaleString()}\n└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    }
  }
};
