/**
 * @fileOverview Microsoft Phi-2 AI Chat.
 */
import axios from 'axios';

export default {
  name: "phi",
  category: "ai-chat",
  description: "Chat with Microsoft's tiny but mighty Phi model.",
  usage: "phi <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/phi?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 📐 PHI AI ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Phi is busy."); }
  }
};
