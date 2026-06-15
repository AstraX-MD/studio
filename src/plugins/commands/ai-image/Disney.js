/**
 * @fileOverview Disney/Pixar Style 3D Generator.
 */
import axios from 'axios';

export default {
  name: "disney",
  aliases: ["pixar"],
  category: "ai-image",
  description: "Generate 3D Disney/Pixar style images.",
  usage: "disney <prompt>",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');

    const { key } = await ctx.reply(`┌──⌈ 🏰 DISNEY AI ⌋\n┃ Status: Rendering Magic...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/disney?text=${encodeURIComponent(prompt)}`,
      `https://api.dlow.xyz/api/disney?q=${encodeURIComponent(prompt)}`,
      `https://api.zahwazein.xyz/api/ai/disney?text=${encodeURIComponent(prompt)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.data || res.data.result || res.data.url;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ ✨ PIXAR STYLE ⌋\n┃ Prompt: ${prompt}\n└─ 🌌 ${botName.toUpperCase()}`,
            edit: key
          });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Magic unit busy.");
  }
};
