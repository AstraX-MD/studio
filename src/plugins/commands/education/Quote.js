/**
 * @fileOverview Inspirational and intellectual quotes.
 */
import axios from 'axios';

export default {
  name: "quote",
  category: "education",
  description: "Get a random quote from history's greatest minds.",
  usage: "quote",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://api.quotable.io/random');
      const d = res.data;

      const output = `┌──⌈ 📜 WISDOM ⌋
┃
┃ "${d.content}"
┃
┃ — ${d.author}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Wisdom unavailable.\n└────────────────`);
    }
  }
};
