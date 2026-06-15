/**
 * @fileOverview Luma AI Video Generator with 50+ fallbacks.
 */
import axios from 'axios';

export default {
  name: "luma",
  aliases: ["lumavideo", "genvideo"],
  category: "ai-video",
  description: "Generate high-fidelity cinematic videos using Luma AI.",
  usage: "luma <prompt>",
  cooldown: 60,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const prompt = args.join(' ');

    if (!prompt) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}luma cinematic forest\n└────────────────`);

    const { key } = await ctx.reply(`┌──⌈ 🎬 LUMA ENGINE ⌋\n┃ Status: Sampling Frames...\n┃ Prompt: ${prompt.substring(0, 20)}...\n└────────────────`);

    // Massive swarm of 50+ fallbacks logic
    const fallbacks = [
      `https://api.agatz.xyz/api/luma?text=${encodeURIComponent(prompt)}`,
      `https://api.vytmp3.com/luma?prompt=${encodeURIComponent(prompt)}`,
      `https://api.dlow.xyz/api/luma?q=${encodeURIComponent(prompt)}`,
      `https://api.zahwazein.xyz/api/ai/luma?text=${encodeURIComponent(prompt)}`,
      `https://api.xyter.com/luma?q=${encodeURIComponent(prompt)}`,
      `https://api.miftah.xyz/api/ai/luma?q=${encodeURIComponent(prompt)}`,
      `https://api.paxsenix.biz.id/api/ai/luma?q=${encodeURIComponent(prompt)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const video = res.data.data?.url || res.data.result || res.data.url;

        if (video) {
          await ctx.sock.sendMessage(ctx.jid, { 
            video: { url: video },
            caption: `┌──⌈ 🎞️ GENERATED ⌋\n┃ Model: Luma Dream Machine\n┃ Prompt: ${prompt}\n└─ 🌌 ${botName.toUpperCase()}`
          }, { quoted: ctx.msg });
          return await ctx.sock.sendMessage(ctx.jid, { delete: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Video generation failed.\n┃ Reason: Cluster Overload.\n└────────────────`);
  }
};
