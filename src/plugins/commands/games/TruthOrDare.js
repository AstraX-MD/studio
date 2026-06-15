/**
 * @fileOverview Social Truth or Dare.
 */
import axios from 'axios';

export default {
  name: "truthordare",
  aliases: ["td"],
  category: "games",
  description: "Get a random truth or dare prompt.",
  usage: "td truth / td dare",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const sub = args[0]?.toLowerCase() || 'truth';

    try {
      const res = await axios.get(`https://api.truthordarebot.xyz/v1/${sub === 'dare' ? 'dare' : 'truth'}`);
      const output = `┌──⌈ 🎭 ${sub.toUpperCase()} ⌋
┃ 
┃ "${res.data.question}"
┃ 
┃ Status: CHALLENGED
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("Service busy. Try again.");
    }
  }
};
