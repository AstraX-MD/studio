/**
 * @fileOverview Get fun life advice.
 */
import axios from 'axios';

export default {
  name: "advice",
  category: "fun",
  description: "Get a random piece of life advice.",
  usage: "advice",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://api.adviceslip.com/advice');
      const output = `┌──⌈ 💡 ADVICE ⌋
┃ 
┃ "${res.data.slip.advice}"
┃
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch wisdom.\n└────────────────`);
    }
  }
};
