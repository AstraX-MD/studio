/**
 * @fileOverview Cryptocurrency price tracker.
 */
import axios from 'axios';

export default {
  name: "crypto",
  aliases: ["coin", "btc"],
  category: "tools",
  description: "Check the current price of a cryptocurrency.",
  usage: "crypto <symbol>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const coin = args[0]?.toLowerCase() || 'bitcoin';

    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`);
      const data = res.data[coin];

      if (!data) throw new Error('Coin not found');

      const output = `┌──⌈ 🪙 CRYPTO WATCH ⌋
┃ Asset: ${coin.toUpperCase()}
┃ Price: $${data.usd.toLocaleString()}
┃ 24h Change: ${data.usd_24h_change.toFixed(2)}%
┃ Currency: USD
└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}crypto btc\n└────────────────`);
    }
  }
};