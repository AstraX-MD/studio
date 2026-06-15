/**
 * @fileOverview Perplexity AI Search.
 */
import axios from 'axios';

export default {
  name: "perplexity",
  category: "ai-chat",
  description: "AI-powered web search via Perplexity.",
  usage: "perplexity <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/perplexity?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 🌐 PERPLEXITY ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Search failed."); }
  }
};
