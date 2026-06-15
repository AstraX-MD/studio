/**
 * @fileOverview Get a random dare.
 */
import axios from 'axios';

export default {
  name: "dare",
  category: "fun",
  description: "Get a random dare challenge.",
  usage: "dare",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://api.truthordarebot.xyz/v1/dare');
      const output = `┌──⌈ 🔥 DARE ⌋
┃ 
┃ "${res.data.question}"
┃
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Challenge source busy.\n└────────────────`);
    }
  }
};
