/**
 * @fileOverview Team trophy cabinet.
 */
import axios from 'axios';

export default {
  name: "trophies",
  aliases: ["cabinet", "honors"],
  category: "football",
  description: "View the honors and trophies won by a club.",
  usage: "trophies <club>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_trophies?query=${encodeURIComponent(query)}`);
      const data = res.data.data;

      let output = `┌──⌈ 🏆 HONORS: ${query.toUpperCase()} ⌋\n┃\n`;
      data.forEach(t => {
        output += `├─ ${t.name}\n┃    ✨ Count: ${t.count}\n┃\n`;
      });
      output += `└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Trophy records busy.\n└────────────────");
    }
  }
};
