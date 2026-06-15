/**
 * @fileOverview View trending global music charts.
 */
import axios from 'axios';

export default {
  name: "trending",
  aliases: ["charts"],
  category: "music",
  description: "Display the current global top tracks.",
  usage: "trending",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    try {
      const res = await axios.get('https://api.deezer.com/chart');
      const tracks = res.data.tracks.data.slice(0, 10);

      let output = `┌──⌈ 📈 GLOBAL CHARTS ⌋\n┃\n`;
      tracks.forEach((t, i) => {
        output += `├─ ${i + 1}. ${t.title}\n┃    by ${t.artist.name}\n`;
      });
      output += `┃\n└─ 🌌 ${botName.toUpperCase()}`;

      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch charts.\n└────────────────`);
    }
  }
};
