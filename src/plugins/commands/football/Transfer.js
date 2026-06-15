/**
 * @fileOverview Transfer market news.
 */
import axios from 'axios';

export default {
  name: "transfers",
  aliases: ["market", "tnews"],
  category: "football",
  description: "Get the latest football transfer market news.",
  usage: "transfers",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://api.agatz.xyz/api/football_transfers');
      const data = res.data.data;

      let output = `┌──⌈ 💸 TRANSFER HUB ⌋\n┃\n`;
      data.slice(0, 6).forEach((t, i) => {
        output += `├─ ${i + 1}. ${t.player}\n┃    🔄 ${t.from} ➔ ${t.to}\n┃    💰 Value: ${t.fee || 'Rumor'}\n┃\n`;
      });
      output += `└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Market desk is closed.\n└────────────────");
    }
  }
};
