/**
 * @fileOverview DALL-E 3 Image Generator.
 */
import axios from 'axios';

export default {
  name: "dalle3",
  category: "ai-image",
  description: "Generate photo-realistic images via DALL-E 3.",
  usage: "dalle3 <prompt>",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');
    const url = `https://api.agatz.xyz/api/dalle3?text=${encodeURIComponent(prompt)}`;
    try {
      await ctx.reply("┌──⌈ 🖼️ DALL-E 3 ⌋\n┃ Generating high-res art...\n└────────────────");
      const res = await axios.get(url);
      await ctx.sock.sendMessage(ctx.jid, { image: { url: res.data.data }, caption: `┌──⌈ 💎 DALL-E 3 ⌋\n└─ 🌌 ${botName.toUpperCase()}` });
    } catch (e) { ctx.reply("DALL-E 3 is busy."); }
  }
};
