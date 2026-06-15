/**
 * @fileOverview Microsoft Bing AI.
 */
import axios from 'axios';

export default {
  name: "bing",
  category: "ai-chat",
  description: "Chat with Microsoft Bing AI.",
  usage: "bing <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/bing?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 🔍 BING ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Bing is busy."); }
  }
};
