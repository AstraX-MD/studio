/**
 * @fileOverview Real-time currency conversion.
 */
import axios from 'axios';

export default {
  name: "currency",
  aliases: ["convert", "forex"],
  category: "tools",
  description: "Convert between currencies (Default: USD to EUR).",
  usage: "currency <amount> <from> <to>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const amount = parseFloat(args[0]) || 1;
    const from = (args[1] || 'USD').toUpperCase();
    const to = (args[2] || 'EUR').toUpperCase();

    try {
      const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const rate = res.data.rates[to];
      const result = (amount * rate).toFixed(2);

      const output = `┌──⌈ 💱 CURRENCY ⌋
┃ From: ${amount} ${from}
┃ To: ${result} ${to}
┃ Rate: 1 ${from} = ${rate} ${to}
└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}currency 100 USD KES\n└────────────────`);
    }
  }
};