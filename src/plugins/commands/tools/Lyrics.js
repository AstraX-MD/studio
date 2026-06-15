/**
 * @fileOverview Song lyrics search.
 */
import axios from 'axios';

export default {
  name: "lyrics",
  category: "tools",
  description: "Get the lyrics of a song.",
  usage: "lyrics <song name>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const song = args.join(' ');
    if (!song) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}lyrics starboy\n└────────────────`);

    try {
      const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song)}`);
      const output = `┌──⌈ 🎵 LYRICS ⌋
┃ Target: ${song}
┃ 
${res.data.lyrics.substring(0, 1000)}${res.data.lyrics.length > 1000 ? '...' : ''}
┃
└─ 🌌 AstraX Enterprise`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Lyrics not found.\n└────────────────`);
    }
  }
};