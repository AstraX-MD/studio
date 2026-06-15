/**
 * @fileOverview Fetch summaries from Wikipedia.
 */
import axios from 'axios';

export default {
  name: "wiki",
  aliases: ["wikipedia"],
  category: "tools",
  description: "Search Wikipedia for summaries.",
  usage: "wiki <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const query = args.join(' ');
    if (!query) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}wiki <query>\n└────────────────`);

    try {
      const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      const data = res.data;

      const output = `┌──⌈ 📚 WIKIPEDIA ⌋
┃ Title: ${data.title}
┃ 
┃ ${data.extract}
┃
┃ Read More: ${data.content_urls.desktop.page}
└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Topic not found on Wikipedia.\n└────────────────`);
    }
  }
};