/**
 * @fileOverview Meta Llama-3 AI Chat.
 */
import axios from 'axios';

export default {
  name: "llama",
  aliases: ["metaai"],
  category: "ai-chat",
  description: "Chat with Meta's Llama-3 model.",
  usage: "llama <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/llama?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 🦙 LLAMA-3 ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Error connecting to Meta AI."); }
  }
};
