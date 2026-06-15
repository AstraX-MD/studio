/**
 * @fileOverview Blackbox AI for Coding & General queries.
 */
import axios from 'axios';

export default {
  name: "blackbox",
  aliases: ["bb"],
  category: "ai-chat",
  description: "Chat with Blackbox AI (Optimized for coding).",
  usage: "blackbox <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/blackbox?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 🔳 BLACKBOX ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Blackbox is busy."); }
  }
};
