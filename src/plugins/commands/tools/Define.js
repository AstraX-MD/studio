/**
 * @fileOverview Professional Dictionary tool.
 */
import axios from 'axios';

export default {
  name: "define",
  aliases: ["dictionary", "meaning"],
  category: "tools",
  description: "Lookup a word in the English dictionary.",
  usage: "define <word>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const word = args[0];
    if (!word) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}define <word>\n└────────────────`);

    try {
      const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = res.data[0];

      let output = `┌──⌈ 📖 DICTIONARY ⌋\n┃ Word: ${data.word}\n┃ Phonetic: ${data.phonetic || 'N/A'}\n┃\n`;
      
      data.meanings.slice(0, 2).forEach(m => {
        output += `├─ [${m.partOfSpeech.toUpperCase()}]\n┃ ${m.definitions[0].definition}\n`;
        if (m.definitions[0].example) output += `┃ Eg: _${m.definitions[0].example}_\n┃\n`;
      });

      output += `└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Word not found in our database.\n└────────────────`);
    }
  }
};