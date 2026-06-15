/**
 * @fileOverview High-speed Wikipedia research tool with 10+ fallback sources.
 */
import axios from 'axios';

export default {
  name: "wiki",
  aliases: ["wikipedia", "research"],
  category: "education",
  description: "Search for detailed summaries and academic info on any topic.",
  usage: "wiki <topic>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const query = args.join(' ');

    if (!query) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}wiki <topic>\n└────────────────`);

    const { key } = await ctx.reply(`┌──⌈ 📚 RESEARCHING ⌋\n┃ Topic: ${query}\n┃ Status: Querying Archives...\n└────────────────`);

    const fallbacks = [
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
      `https://api.agatz.xyz/api/wikipedia?search=${encodeURIComponent(query)}`,
      `https://api.dlow.xyz/api/wiki?q=${encodeURIComponent(query)}`,
      `https://api.vytmp3.com/wiki?query=${encodeURIComponent(query)}`,
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`,
      `https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q=${encodeURIComponent(query)}`,
      `https://en.wiktionary.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
      `https://api.xyter.com/wiki?q=${encodeURIComponent(query)}`,
      `https://api.zahwazein.xyz/api/wiki?q=${encodeURIComponent(query)}`,
      `https://api.miftah.xyz/api/wiki?q=${encodeURIComponent(query)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const data = res.data;
        const title = data.title || data.displaytitle || data.Heading;
        const extract = data.extract || data.result || data.Abstract;
        const link = data.content_urls?.desktop?.page || data.link || `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`;

        if (extract) {
          const output = `┌──⌈ 📚 KNOWLEDGE ⌋
┃
┃ Topic: ${title}
┃ 
┃ ${extract.substring(0, 1000)}${extract.length > 1000 ? '...' : ''}
┃
├─⊷ Source: Wikipedia
├─⊷ Link: ${link}
└────────────────
  © ${botName.toUpperCase()}`;

          return await ctx.sock.sendMessage(ctx.jid, { text: output, edit: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to resolve topic.\n┃ Reason: Archives unavailable.\n└────────────────`);
  }
};
