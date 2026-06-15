/**
 * @fileOverview Pika Art Video Generator.
 */
import axios from 'axios';

export default {
  name: "pika",
  category: "ai-video",
  description: "Generate stylized animations using Pika Art.",
  usage: "pika <prompt>",
  cooldown: 60,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');

    await ctx.reply(`┌──⌈ 🎨 PIKA ART ⌋\n┃ Status: Animating...\n┃ Style: Motion-Blur\n└────────────────`);

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/pika?text=${encodeURIComponent(prompt)}`);
      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: res.data.data },
        caption: `┌──⌈ ✨ PIKA GEN ⌋\n┃ Status: Rendered\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Pika Art is currently busy.");
    }
  }
};
