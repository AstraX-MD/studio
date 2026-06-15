/**
 * @fileOverview Search for tracks on JioSaavn.
 */
import axios from 'axios';

export default {
  name: "jiosaavn",
  aliases: ["saavn"],
  category: "music",
  description: "Search for songs on JioSaavn (Bollywood/Indie).",
  usage: "saavn <query>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://saavn.me/search/songs?query=${encodeURIComponent(query)}`);
      const track = res.data.data.results[0];

      const output = `┌──⌈ 🎵 JIOSAAVN ⌋
┃ 
├─ Track: ${track.name}
├─ Artist: ${track.primaryArtists}
├─ Album: ${track.album.name}
├─ Year: ${track.year}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: track.image[2].link },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ JioSaavn search failed.\n└────────────────`);
    }
  }
};
