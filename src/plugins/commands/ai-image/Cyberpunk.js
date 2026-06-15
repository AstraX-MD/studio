/**
 * @fileOverview Futuristic Cyberpunk Style Generator.
 */
import axios from 'axios';

export default {
  name: "cyberpunk",
  category: "ai-image",
  description: "Generate neon-lit futuristic cyberpunk images.",
  usage: "cyberpunk <prompt>",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prompt = args.join(' ');

    const { key } = await ctx.reply(`┌──⌈ 🌃 CYBERPUNK ⌋\n┃ Status: Lighting Neons...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/cyberpunk?text=${encodeURIComponent(prompt)}`,
      `https://api.dlow.xyz/api/cyberpunk?q=${encodeURIComponent(prompt)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.data || res.data.result;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ 🔋 NEON FUTURE ⌋\n┃ Style: Night City\n└─ 🌌 ${botName.toUpperCase()}`,
            edit: key
          });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Grid offline.");
  }
};
