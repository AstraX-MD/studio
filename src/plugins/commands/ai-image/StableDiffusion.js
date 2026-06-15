/**
 * @fileOverview Stable Diffusion SDXL Generator.
 */
import axios from 'axios';

export default {
  name: "sdxl",
  aliases: ["sd", "diffusion"],
  category: "ai-image",
  description: "Generate images using Stable Diffusion XL.",
  usage: "sdxl <prompt>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');
    if (!prompt) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Prompt required.\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🌀 DIFFUSION ⌋\n┃ Status: Latent Sampling...\n┃ Engine: SDXL-Turbo\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/sdxl?text=${encodeURIComponent(prompt)}`,
      `https://api.vytmp3.com/sd?prompt=${encodeURIComponent(prompt)}`,
      `https://api.dlow.xyz/api/sdxl?q=${encodeURIComponent(prompt)}`,
      `https://api.zahwazein.xyz/api/ai/sdxl?text=${encodeURIComponent(prompt)}`,
      `https://api.miftah.xyz/api/ai/sdxl?q=${encodeURIComponent(prompt)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.data || res.data.result || res.data.url;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ 🎨 SDXL GEN ⌋\n┃ Prompt: ${prompt}\n└─ 🌌 ${botName.toUpperCase()}`,
            edit: key
          });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ All diffusion nodes busy.\n└────────────────");
  }
};
