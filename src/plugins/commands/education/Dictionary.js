/**
 * @fileOverview Professional English Dictionary with redundant fallbacks.
 */
import axios from 'axios';

export default {
  name: "dictionary",
  aliases: ["define", "meaning", "vocab"],
  category: "education",
  description: "Lookup accurate definitions and usage examples.",
  usage: "dictionary <word>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const word = args[0];

    if (!word) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}dictionary <word>\n└────────────────`);

    const fallbacks = [
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      `https://api.agatz.xyz/api/dictionary?word=${word}`,
      `https://api.vytmp3.com/define?word=${word}`,
      `https://api.dlow.xyz/api/define?q=${word}`,
      `https://api.xyter.com/define?q=${word}`,
      `https://api.zahwazein.xyz/api/define?q=${word}`,
      `https://api.miftah.xyz/api/define?q=${word}`,
      `https://api.caliph.biz.id/api/define?q=${word}`,
      `https://api.paxsenix.biz.id/api/define?q=${word}`,
      `https://api.yanzbotz.my.id/api/define?q=${word}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        
        if (data && data.word) {
          let output = `┌──⌈ 📖 LEXICON ⌋
┃
┃ Word: ${data.word.toUpperCase()}
┃ Phonetic: ${data.phonetic || 'N/A'}
┃\n`;

          data.meanings.slice(0, 2).forEach(m => {
            output += `├─ [${m.partOfSpeech.toUpperCase()}]\n┃ ${m.definitions[0].definition}\n`;
            if (m.definitions[0].example) output += `┃ Eg: _${m.definitions[0].example}_\n┃\n`;
          });

          output += `└────────────────
  © ${botName.toUpperCase()}`;
          return ctx.reply(output);
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Definition not found.\n└────────────────`);
  }
};
