/**
 * @fileOverview OpenChat AI.
 */
import axios from 'axios';

export default {
  name: "openchat",
  category: "ai-chat",
  description: "Chat with OpenChat AI.",
  usage: "openchat <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    const url = `https://api.agatz.xyz/api/openchat?message=${encodeURIComponent(query)}`;
    try {
      const res = await axios.get(url);
      ctx.reply(`┌──⌈ 📂 OPENCHAT ⌋\n┃\n┃ ${res.data.data}\n┃\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) { ctx.reply("OpenChat error."); }
  }
};
