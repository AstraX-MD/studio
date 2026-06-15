/**
 * @fileOverview Midjourney Style Image Generator.
 */
import axios from 'axios';

export default {
  name: "midjourney",
  category: "ai-image",
  description: "Generate artistic Midjourney-style images.",
  usage: "midjourney <prompt>",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');
    const url = `https://api.agatz.xyz/api/midjourney?text=${encodeURIComponent(prompt)}`;
    try {
      await ctx.reply("┌──⌈ 🎭 MIDJOURNEY ⌋\n┃ Rendering masterpiece...\n└────────────────");
      const res = await axios.get(url);
      await ctx.sock.sendMessage(ctx.jid, { image: { url: res.data.data }, caption: `┌──⌈ 🌠 MASTERPIECE ⌋\n└─ 🌌 ${botName.toUpperCase()}` });
    } catch (e) { ctx.reply("Art unit offline."); }
  }
};
