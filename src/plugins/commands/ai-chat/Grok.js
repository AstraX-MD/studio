/**
 * @fileOverview xAI Grok (Mock/Proxy).
 */
import axios from 'axios';

export default {
  name: "grok",
  category: "ai-chat",
  description: "Chat with Grok AI.",
  usage: "grok <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/grok?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ ✖️ GROK ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Grok is recalibrating."); }
  }
};
