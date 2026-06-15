/**
 * @fileOverview Search for movie and series details.
 */
import axios from 'axios';

export default {
  name: "movie",
  aliases: ["series", "imdb"],
  category: "tools",
  description: "Retrieve detailed information about any movie or TV series.",
  usage: "movie <title>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Movie title required.\n└────────────────");

    try {
      const res = await axios.get(`http://www.omdbapi.com/?apikey=30076a91&t=${encodeURIComponent(query)}`);
      const d = res.data;

      if (d.Response === 'False') throw new Error('Not found');

      const output = `┌──⌈ 🎬 MOVIE AUDIT ⌋
┃
┃ Title: ${d.Title}
┃ Year: ${d.Year} | Rated: ${d.Rated}
┃ Genre: ${d.Genre}
┃
├─⊷ Director: ${d.Director}
├─⊷ Rating: ⭐ ${d.imdbRating}/10
├─⊷ Cast: ${d.Actors}
┃
┃ Plot: ${d.Plot.substring(0, 200)}...
┃
└────────────────
  © ${botName.toUpperCase()}`;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: d.Poster !== 'N/A' ? d.Poster : 'https://i.ibb.co/L9H86vG/movie.png' },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Media not found or API limited.");
    }
  }
};
