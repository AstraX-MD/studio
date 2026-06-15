/**
 * @fileOverview Google Books search.
 */
import axios from 'axios';

export default {
  name: "book",
  category: "education",
  description: "Search for books and academic publications.",
  usage: "book <title>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
      const b = res.data.items[0].volumeInfo;

      const output = `┌──⌈ 📚 BOOK SEARCH ⌋
┃
┃ Title: ${b.title}
┃ Author: ${b.authors?.[0] || 'Unknown'}
┃ Published: ${b.publishedDate}
┃ Pages: ${b.pageCount || 'N/A'}
┃
┃ Description: ${b.description?.substring(0, 200)}...
┃
└────────────────
  © ${botName.toUpperCase()}`;
      
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: b.imageLinks?.thumbnail },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Book not found.\n└────────────────`);
    }
  }
};
