/**
 * @fileOverview Mistral AI Chat.
 */
import axios from 'axios';

export default {
  name: "mistral",
  category: "ai-chat",
  description: "Chat with the efficient Mistral-7B model.",
  usage: "mistral <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const fallbacks = [`https://api.agatz.xyz/api/mistral?message=${encodeURIComponent(query)}`];
    try {
      const res = await axios.get(fallbacks[0]);
      ctx.reply(`┌──⌈ 🌀 MISTRAL ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Busy..."); }
  }
};
