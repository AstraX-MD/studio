/**
 * @fileOverview Code-optimized Llama.
 */
import axios from 'axios';

export default {
  name: "codellama",
  category: "ai-chat",
  description: "AI-powered coding assistant.",
  usage: "codellama <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/codellama?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 💻 CODELLAMA ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Coding unit error."); }
  }
};
