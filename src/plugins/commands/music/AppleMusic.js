/**
 * @fileOverview Search Apple Music tracks.
 */
import axios from 'axios';

export default {
  name: "applemusic",
  aliases: ["apple"],
  category: "music",
  description: "Search for tracks on Apple Music.",
  usage: "apple <query>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=1&entity=song`);
      const track = res.data.results[0];

      const output = `┌──⌈ 🍎 APPLE MUSIC ⌋
┃ 
├─ Track: ${track.trackName}
├─ Artist: ${track.artistName}
├─ Price: ${track.trackPrice} ${track.currency}
├─ Link: ${track.trackViewUrl}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: track.artworkUrl100.replace('100x100', '600x600') },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Apple Music search failed.\n└────────────────`);
    }
  }
};
