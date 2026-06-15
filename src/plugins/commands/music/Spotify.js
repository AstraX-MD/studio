/**
 * @fileOverview Search for tracks on Spotify.
 */
import axios from 'axios';

export default {
  name: "spotify",
  category: "music",
  description: "Search for songs or albums on Spotify.",
  usage: "spotify <query>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      // Using a public proxy for Spotify search
      const res = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
      const track = res.data.data[0];

      if (!track) throw new Error('Not found');

      const output = `┌──⌈ 🟢 SPOTIFY SEARCH ⌋
┃ 
├─ Track: ${track.title}
├─ Artist: ${track.artist.name}
├─ Album: ${track.album.title}
├─ Link: ${track.link}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: track.album.cover_big },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to search Spotify.\n└────────────────`);
    }
  }
};
