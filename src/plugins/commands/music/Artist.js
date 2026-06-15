/**
 * @fileOverview Get information about a music artist.
 */
import axios from 'axios';

export default {
  name: "artist",
  category: "music",
  description: "Get details about a music artist.",
  usage: "artist <name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}`);
      const artist = res.data.data[0];

      const output = `┌──⌈ 👤 ARTIST INFO ⌋
┃ 
├─ Name: ${artist.name}
├─ Fans: ${artist.nb_fan.toLocaleString()}
├─ Albums: ${artist.nb_album}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: artist.picture_xl },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Artist not found.\n└────────────────`);
    }
  }
};
