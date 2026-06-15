/**
 * @fileOverview Generate an ice style logo.
 */
import axios from 'axios';

export default {
  name: "ice",
  aliases: ["icelogo"],
  category: "logos",
  description: "Generate a frozen ice style logo.",
  usage: "ice <text>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const text = args.join(' ');

    if (!text) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}ice <text>\n└────────────────`);

    const { key } = await ctx.reply(`┌──⌈ 🎨 LOGO GEN ⌋\n┃ Theme: Ice\n┃ Status: Freezing...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/textpro?theme=ice&text=${encodeURIComponent(text)}`,
      `https://api.dlow.xyz/api/textpro?theme=ice&text=${encodeURIComponent(text)}`,
      `https://api.zahwazein.xyz/api/textpro/ice?text=${encodeURIComponent(text)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.data || res.data.result || res.data.url;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ ❄️ ICE LOGO ⌋\n┃ Text: ${text}\n┃ Status: Generated\n└─ 🌌 ${botName.toUpperCase()}`,
            edit: key
          });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Generation failed.\n└────────────────`);
  }
};