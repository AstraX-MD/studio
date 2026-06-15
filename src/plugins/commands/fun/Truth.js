/**
 * @fileOverview Get a random truth question.
 */
import axios from 'axios';

export default {
  name: "truth",
  category: "fun",
  description: "Get a random truth question.",
  usage: "truth",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://api.truthordarebot.xyz/v1/truth');
      const output = `┌──⌈ 📜 TRUTH ⌋
┃ 
┃ "${res.data.question}"
┃
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Wisdom source busy.\n└────────────────`);
    }
  }
};
