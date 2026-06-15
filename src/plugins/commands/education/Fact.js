/**
 * @fileOverview Scientific and global facts.
 */
import axios from 'axios';

export default {
  name: "fact",
  category: "education",
  description: "Get a random educational fact.",
  usage: "fact",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    try {
      const res = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      const output = `┌──⌈ 🧐 DID YOU KNOW? ⌋
┃
┃ ${res.data.text}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch facts.\n└────────────────`);
    }
  }
};
