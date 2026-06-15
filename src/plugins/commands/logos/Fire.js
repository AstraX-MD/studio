/**
 * @fileOverview Generate a fire style logo.
 */
import axios from 'axios';

export default {
  name: "fire",
  aliases: ["firelogo"],
  category: "logos",
  description: "Generate a blazing fire style logo.",
  usage: "fire <text>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const text = args.join(' ');

    if (!text) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}fire <text>\n└────────────────`);

    const { key } = await ctx.reply(`┌──⌈ 🎨 LOGO GEN ⌋\n┃ Theme: Fire\n┃ Status: Igniting...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/textpro?theme=fire&text=${encodeURIComponent(text)}`,
      `https://api.dlow.xyz/api/textpro?theme=fire&text=${encodeURIComponent(text)}`,
      `https://api.zahwazein.xyz/api/textpro/fire?text=${encodeURIComponent(text)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const img = res.data.data || res.data.result || res.data.url;
        if (img) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            image: { url: img },
            caption: `┌──⌈ 🔥 FIRE LOGO ⌋\n┃ Text: ${text}\n┃ Status: Generated\n└─ 🌌 ${botName.toUpperCase()}`,
            edit: key
          });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Generation failed.\n└────────────────`);
  }
};