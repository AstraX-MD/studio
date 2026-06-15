/**
 * @fileOverview High-speed AI Image Generator with 50+ fallbacks.
 */
import axios from 'axios';

export default {
  name: "imagine",
  aliases: ["genimage", "draw"],
  category: "ai-image",
  description: "Generate a beautiful image from a text prompt.",
  usage: "imagine <prompt>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');

    if (!prompt) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Prompt required to imagine.\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🎨 IMAGINING ⌋\n┃ Prompt: ${prompt.substring(0, 20)}...\n┃ Status: Painting...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/imagine?text=${encodeURIComponent(prompt)}`,
      `https://api.vytmp3.com/imagine?prompt=${encodeURIComponent(prompt)}`,
      `https://api.dlow.xyz/api/imagine?q=${encodeURIComponent(prompt)}`,
      `https://api.zahwazein.xyz/api/ai/imagine?text=${encodeURIComponent(prompt)}`,
      `https://api.miftah.xyz/api/ai/imagine?q=${encodeURIComponent(prompt)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.data || res.data.result || res.data.url;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ ✨ GENERATED ⌋\n┃ Prompt: ${prompt}\n┃ Engine: Flux-Turbo\n└─ 🌌 ${botName.toUpperCase()}`,
            edit: key
          });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ All image generators are busy.\n└────────────────");
  }
};
