/**
 * @fileOverview Search for music on Deezer.
 */
import axios from 'axios';

export default {
  name: "deezer",
  category: "music",
  description: "Search for tracks on Deezer.",
  usage: "deezer <query>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
      const track = res.data.data[0];

      const output = `┌──⌈ 🟣 DEEZER ⌋
┃ 
├─ Track: ${track.title}
├─ Artist: ${track.artist.name}
├─ Album: ${track.album.title}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: track.album.cover_xl },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Deezer search failed.\n└────────────────`);
    }
  }
};
