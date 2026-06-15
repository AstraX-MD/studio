/**
 * @fileOverview OpenAI Sora Video Synthesis (Proxy).
 */
import axios from 'axios';

export default {
  name: "sora",
  category: "ai-video",
  description: "Generate ultra-realistic videos via Sora AI proxies.",
  usage: "sora <prompt>",
  cooldown: 60,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');

    const { key } = await ctx.reply(`┌──⌈ 🌌 SORA AI ⌋\n┃ Status: Neural Rendering...\n┃ Mode: Ultra-Realistic\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/sora?text=${encodeURIComponent(prompt)}`,
      `https://api.vytmp3.com/sora?q=${encodeURIComponent(prompt)}`,
      `https://api.dlow.xyz/api/sora?prompt=${encodeURIComponent(prompt)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const video = res.data.data || res.data.result;
        if (video) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            video: { url: video },
            caption: `┌──⌈ 🎬 SORA RENDER ⌋\n┃ Status: Complete\n└─ 🌌 ${botName.toUpperCase()}`,
            edit: key
          });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Sora nodes are at capacity.");
  }
};
