/**
 * @fileOverview Falcon AI Chat.
 */
import axios from 'axios';

export default {
  name: "falcon",
  category: "ai-chat",
  description: "Chat with the Falcon LLM.",
  usage: "falcon <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/falcon?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 🦅 FALCON ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Falcon is away."); }
  }
};
