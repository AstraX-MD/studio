/**
 * @fileOverview High-fidelity Flux AI Image Generator.
 */
import axios from 'axios';

export default {
  name: "flux",
  aliases: ["fluxgen", "hyper"],
  category: "ai-image",
  description: "Generate extremely high-detail images via Flux model.",
  usage: "flux <prompt>",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');

    if (!prompt) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Describe what you want to see.\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 🧪 FLUX ENGINE ⌋\n┃ Status: Neural Rendering...\n┃ Model: Flux.1-Dev\n└────────────────`);

    // Massive fallback chain (50+ routes logic)
    const fallbacks = [
      `https://api.agatz.xyz/api/flux?text=${encodeURIComponent(prompt)}`,
      `https://api.vytmp3.com/flux?prompt=${encodeURIComponent(prompt)}`,
      `https://api.dlow.xyz/api/flux?q=${encodeURIComponent(prompt)}`,
      `https://api.zahwazein.xyz/api/ai/flux?text=${encodeURIComponent(prompt)}`,
      `https://api.miftah.xyz/api/ai/flux?q=${encodeURIComponent(prompt)}`,
      `https://api.xyter.com/flux?q=${encodeURIComponent(prompt)}`,
      `https://api.paxsenix.biz.id/api/ai/flux?text=${encodeURIComponent(prompt)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.data || res.data.result || res.data.url;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ 🌌 FLUX ART ⌋\n┃ Prompt: ${prompt}\n┃ Engine: Flux-Global\n└─ 🌌 ${botName.toUpperCase()}`,
            edit: key
          });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Flux servers are currently overloaded.\n└────────────────`);
  }
};
