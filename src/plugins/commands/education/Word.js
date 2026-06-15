/**
 * @fileOverview Word of the Day.
 */
import axios from 'axios';

export default {
  name: "word",
  category: "education",
  description: "Learn a new advanced vocabulary word every day.",
  usage: "word",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      // Using a word proxy
      const words = ['ubiquitous', 'ephemeral', 'loquacious', 'grandiloquent', 'fastidious'];
      const query = words[Math.floor(Math.random() * words.length)];
      const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
      const data = res.data[0];

      const output = `┌──⌈ 📖 WORD OF DAY ⌋
┃
┃ Word: ${data.word.toUpperCase()}
┃ Meaning: ${data.meanings[0].definitions[0].definition}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Vocab service busy.\n└────────────────`);
    }
  }
};
