/**
 * @fileOverview Would You Rather.
 */
import axios from 'axios';

export default {
  name: "wyr",
  aliases: ["rather"],
  category: "fun",
  description: "Get a 'Would You Rather' dilemma.",
  usage: "wyr",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://api.truthordarebot.xyz/v1/wyr');
      const output = `┌──⌈ 🤔 WYR ⌋
┃ 
┃ Would You Rather...
┃
┃ "${res.data.question}"
┃
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Dilemma machine busy.\n└────────────────`);
    }
  }
};
