/**
 * @fileOverview Zephyr AI Chat.
 */
import axios from 'axios';

export default {
  name: "zephyr",
  category: "ai-chat",
  description: "Chat with the Zephyr-7B model.",
  usage: "zephyr <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/zephyr?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 🍃 ZEPHYR ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Zephyr error."); }
  }
};
