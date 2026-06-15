/**
 * @fileOverview Kling AI Video Generator.
 */
import axios from 'axios';

export default {
  name: "kling",
  category: "ai-video",
  description: "Generate high-quality AI videos using Kling model.",
  usage: "kling <prompt>",
  cooldown: 60,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');

    await ctx.reply(`┌──⌈ 🎞️ KLING AI ⌋\n┃ Status: Processing Scene...\n┃ Engine: Kling-V1\n└────────────────`);

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/kling?text=${encodeURIComponent(prompt)}`);
      const video = res.data.data;
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: video },
        caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Model: Kling AI\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Kling server rejected request.");
    }
  }
};
