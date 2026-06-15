/**
 * @fileOverview Synonym and Antonym lookup.
 */
import axios from 'axios';

export default {
  name: "thesaurus",
  aliases: ["synonym"],
  category: "education",
  description: "Find synonyms for any word.",
  usage: "thesaurus <word>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const word = args[0];

    try {
      const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const synonyms = res.data[0].meanings[0].definitions[0].synonyms;

      const output = `┌──⌈ 📖 THESAURUS ⌋
┃
┃ Word: ${word.toUpperCase()}
┃ Synonyms: ${synonyms.slice(0, 5).join(', ') || 'None found'}
┃
└────────────────
  © ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ No synonyms found.\n└────────────────`);
    }
  }
};
