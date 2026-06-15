/**
 * @fileOverview Pi AI (Inflection).
 */
import axios from 'axios';

export default {
  name: "pi",
  category: "ai-chat",
  description: "Chat with the supportive Pi AI.",
  usage: "pi <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/pi?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 🥧 PI AI ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("Pi is offline."); }
  }
};
