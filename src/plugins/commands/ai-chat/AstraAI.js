/**
 * @fileOverview Universal AstraX Hybrid AI.
 */
import axios from 'axios';

export default {
  name: "ai",
  aliases: ["astra", "ask"],
  category: "ai-chat",
  description: "Universal AstraX AI assistant.",
  usage: "ai <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/smart_ai?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 🌌 ASTRA AI ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("AI Matrix error."); }
  }
};
