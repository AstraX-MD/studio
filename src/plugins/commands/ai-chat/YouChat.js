/**
 * @fileOverview You.com AI Chat.
 */
import axios from 'axios';

export default {
  name: "youchat",
  category: "ai-chat",
  description: "Chat with YouChat AI.",
  usage: "youchat <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/youchat?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 🧑‍🚀 YOUCHAT ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("YouChat is busy."); }
  }
};
