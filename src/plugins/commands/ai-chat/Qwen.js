/**
 * @fileOverview Alibaba Qwen AI Chat.
 */
import axios from 'axios';

export default {
  name: "qwen",
  category: "ai-chat",
  description: "Chat with Alibaba's Qwen LLM.",
  usage: "qwen <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/qwen?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 💮 QWEN ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Qwen is busy."); }
  }
};
