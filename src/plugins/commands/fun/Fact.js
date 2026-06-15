/**
 * @fileOverview Get strange but true facts.
 */
import axios from 'axios';

export default {
  name: "fact",
  category: "fun",
  description: "Get a random strange but true fact.",
  usage: "fact",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      const output = `┌──⌈ 🧐 STRANGE FACT ⌋
┃ 
┃ "${res.data.text}"
┃
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Archives currently locked.\n└────────────────`);
    }
  }
};
