/**
 * @fileOverview Web Search via Google Proxy.
 */
import axios from 'axios';

export default {
  name: "google",
  aliases: ["search", "gsearch"],
  category: "tools",
  description: "Search the web for information.",
  usage: "google <query>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const query = args.join(' ');
    if (!query) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}google what is nextjs\n└────────────────`);

    try {
      const res = await axios.get(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=YOUR_GOOGLE_API_KEY&cx=YOUR_CX`);
      const items = res.data.items.slice(0, 3);

      let output = `┌──⌈ 🔍 GOOGLE SEARCH ⌋\n┃ Query: ${query}\n┃\n`;
      items.forEach((it, i) => {
        output += `├─ ${i + 1}. ${it.title}\n┃ 🔗 ${it.link}\n┃\n`;
      });
      output += `└─ 🌌 AstraX Enterprise`;

      ctx.reply(output);
    } catch (e) {
      // Fallback message since key might not be set
      ctx.reply(`┌──⌈ 🔍 SEARCH ⌋\n┃ Query: ${query}\n┃ \n┃ Search results currently unavailable via API.\n┃ Please check documentation for API setup.\n└────────────────`);
    }
  }
};