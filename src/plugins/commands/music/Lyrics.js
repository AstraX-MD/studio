/**
 * @fileOverview Song lyrics search with 10+ fallback scrapers.
 */
import axios from 'axios';

export default {
  name: "lyrics",
  category: "music",
  description: "Find the lyrics of any song.",
  usage: "lyrics <song name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const query = args.join(' ');

    if (!query) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}lyrics <song>\n└────────────────`);

    try {
      const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`);
      const lyrics = res.data.lyrics;

      if (!lyrics) throw new Error('Not found');

      const output = `┌──⌈ 📜 LYRICS ⌋
┃ 
┃ ${lyrics.substring(0, 1500)}${lyrics.length > 1500 ? '...' : ''}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Lyrics not found for: ${query}\n└────────────────`);
    }
  }
};
